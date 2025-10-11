'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { HourlyBreakdownTable } from "@/components/HourlyBreakdownTable";
import { TrendChart } from "@/components/TrendChart";

const Index = () => {
  const [currentDate] = useState("2025年08月27日水曜日");

  return (
    
    <div className="min-h-screen bg-background">

      <div className="p-4">
        {/* Top Action Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">日付</span>
            <Card className="px-4 py-2 bg-card">
              <span className="text-sm font-medium">{currentDate}</span>
            </Card>
          </div>
          <div className="text-sm">
            当日の推移
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Metrics */}
          <div className="lg:col-span-2 space-y-4">
            <MetricCard 
              label="売上金額計"
              subLabel="予定+間接+終了"
              current={917350}
              target={1041233}
              colorScheme="success"
            />

            <MetricCard 
              label="売上件数計"
              subLabel="予定+間接+終了"
              current={131}
              target={144}
              colorScheme="default"
            />

            <SimpleMetricCard 
              label="主副菜付時計"
              value={410.5}
              actual={408}
              target={408.0}
              unit=""
            />

            <SimpleMetricCard 
              label="主副出勤人数"
              subLabel="予定+出勤"
              value={68}
              actual={68}
              target={62.0}
              unit=""
              bgColor="bg-warning/10"
            />

            {/* Monthly Comparison */}
            <Card className="p-4">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">店舗日計概</div>
                  <div className="text-sm font-bold text-primary">1041920.1000※1</div>
                  <div className="text-xs text-muted-foreground">2024年8月</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">店舗日計概</div>
                  <div className="text-sm font-bold">1034920</div>
                  <div className="text-xs text-muted-foreground">前期同月比</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">店舗日計概</div>
                  <div className="text-sm font-bold text-muted-foreground">992,727</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">月計計概</div>
                  <div className="text-sm font-bold text-muted-foreground">956,300</div>
                  <div className="text-xs text-muted-foreground">2025年6月</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">直接+&月計概</div>
                  <div className="text-sm font-bold">1,051,960</div>
                  <div className="text-xs text-muted-foreground">2025年6月</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">月計概</div>
                  <div className="text-sm font-bold">969,922</div>
                  <div className="text-xs text-muted-foreground">2025年7月</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">件数</div>
                  <div className="text-sm font-bold">143.3</div>
                  <div className="text-xs text-muted-foreground">件数</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">件数</div>
                  <div className="text-sm font-bold">139.0</div>
                </div>
              </div>
            </Card>

            {/* Chart */}
            <TrendChart />
          </div>

          {/* Right Column - Hourly Breakdown */}
          <div className="lg:col-span-1">
            <HourlyBreakdownTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
