"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { HostessRanking } from "@/types/hostess";
import type { SortKey } from "@/types/hostess-ranking";

interface RankingTransitionChartProps {
  sourceData: HostessRanking[];
  metric: SortKey;
  storeId?: string | "all";
  months?: number;
  topN?: number;
}

interface MonthPoint {
  month: string;
  // dynamic series keys like series_<hostessId>: rank
  [seriesKey: string]: string | number | undefined;
}

const COLOR_VARS = [
  // vivid palette (Tableau-like) to ensure visibility without CSS variables
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
  "#393b79", // indigo
  "#637939", // olive green
];

function getMonthLabels(count: number): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    result.push(`${y}-${m}`);
  }
  return result;
}

function seededNoise(seed: string): number {
  // simple deterministic hash -> [0,1)
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // convert to [0,1)
  const u = (h >>> 0) / 4294967296;
  // map to roughly [-0.12, 0.12]
  return (u - 0.5) * 0.24;
}

function getMetricValue(hostess: HostessRanking, metric: SortKey): number {
  const raw = (hostess as unknown as Record<string, number | undefined>)[metric];
  return typeof raw === "number" ? raw : 0;
}

export const RankingTransitionChart: React.FC<RankingTransitionChartProps> = ({
  sourceData,
  metric,
  storeId = "all",
  months = 6,
  topN = 5,
}) => {
  const filtered = useMemo(() => {
    if (!sourceData || sourceData.length === 0) return [] as HostessRanking[];
    if (!storeId || storeId === "all") return sourceData;
    return sourceData.filter((h) => h.storeId === storeId);
  }, [sourceData, storeId]);

  const selectedHostessIds = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => getMetricValue(b, metric) - getMetricValue(a, metric)
    );
    return sorted.slice(0, topN).map((h) => h.hostessId);
  }, [filtered, metric, topN]);

  const seriesMeta = useMemo(() => {
    // id -> { key, name, color }
    const map = new Map<string, { key: string; name: string; color: string }>();
    selectedHostessIds.forEach((id, idx) => {
      const target = filtered.find((h) => h.hostessId === id);
      const name = target?.stageName ?? target?.hostessName ?? id;
      map.set(id, {
        key: `series_${id}`,
        name,
        color: COLOR_VARS[idx % COLOR_VARS.length],
      });
    });
    return map;
  }, [filtered, selectedHostessIds]);

  const chartData: MonthPoint[] = useMemo(() => {
    const labels = getMonthLabels(months);
    const points: MonthPoint[] = [];
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];

      // compute month values with deterministic noise per hostessId+label
      const monthValues = filtered.map((h) => {
        const base = getMetricValue(h, metric);
        let value = base;
        if (metric === "monthlyEarnings" && typeof h.earningsGrowthRate === "number") {
          // back-propagate using growth rate as an approximation plus noise
          const back = labels.length - 1 - i;
          const growth = h.earningsGrowthRate / 100;
          const denom = Math.pow(1 + growth, back || 0);
          value = denom !== 0 ? base / denom : base;
        }
        const noise = seededNoise(`${h.hostessId}_${label}_${metric}`);
        // apply ±12% noise scaled slightly by how far in the past
        const backFactor = 1 + (labels.length - 1 - i) * 0.02; // older months a bit more variance
        value = Math.max(0, value * (1 + noise * backFactor));
        return { id: h.hostessId, value };
      });

      // rank descending by value
      monthValues.sort((a, b) => b.value - a.value);
      const rankMap = new Map<string, number>();
      monthValues.forEach((mv, idx) => {
        rankMap.set(mv.id, idx + 1);
      });

      const point: MonthPoint = { month: label };
      selectedHostessIds.forEach((id) => {
        const meta = seriesMeta.get(id);
        if (!meta) return;
        point[meta.key] = rankMap.get(id) ?? undefined;
      });
      points.push(point);
    }
    return points;
  }, [filtered, metric, months, selectedHostessIds, seriesMeta]);

  if (filtered.length === 0 || selectedHostessIds.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 border text-sm text-muted-foreground">
        データがありません
      </div>
    );
  }

  const maxRank = Math.min(topN, filtered.length);

  return (
    <div className="bg-card rounded-lg p-4 border">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <YAxis
            allowDecimals={false}
            domain={[1, maxRank]}
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            reversed
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.25rem",
            }}
            formatter={(value: number) => `第${value}位`}
            labelFormatter={(label) => `${label}`}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {Array.from(seriesMeta.entries()).map(([id, meta], idx) => (
            <Line
              key={id}
              type="linear"
              dataKey={meta.key}
              name={meta.name}
              stroke={meta.color}
              strokeWidth={2}
              strokeOpacity={0.95}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              dot={{ r: 3, stroke: meta.color, fill: meta.color }}
              activeDot={{ r: 4 }}
              strokeDasharray={idx % 3 === 1 ? "4 3" : idx % 3 === 2 ? "2 2" : undefined}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingTransitionChart;


