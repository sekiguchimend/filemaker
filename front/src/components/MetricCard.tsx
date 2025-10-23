import { Card } from "@/components/ui/card";
import type { MetricCardProps } from '@/types/metric-card';

export const MetricCard = ({ 
  label, 
  current, 
  target, 
  unit = "", 
  subLabel,
  colorScheme = "default" 
}: MetricCardProps) => {
  const variance = current - target;
  const variancePercent = target !== 0 ? ((variance / target) * 100) : 0;
  const isPositive = variance >= 0;

  const getBgColor = () => {
    if (colorScheme === "success") return "bg-success/10";
    if (colorScheme === "neutral") return "bg-muted";
    return "bg-primary/10";
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      {subLabel && <div className="text-xs text-muted-foreground">{subLabel}</div>}
      
      <div className="grid grid-cols-3 gap-2">
        <Card className={`p-3 ${getBgColor()} border-0`}>
          <div className="text-xs text-muted-foreground mb-1">当日</div>
          <div className="text-lg font-bold">
            {current.toLocaleString()}{unit}
          </div>
        </Card>

        <Card className="p-3 bg-primary border-0">
          <div className="text-xs text-primary-foreground/80 mb-1">達成目標</div>
          <div className="text-lg font-bold text-primary-foreground">
            {target.toLocaleString()}{unit}
          </div>
        </Card>

        <Card className={`p-3 ${isPositive ? 'bg-success' : 'bg-destructive'} border-0`}>
          <div className={`text-xs mb-1 ${isPositive ? 'text-success-foreground/80' : 'text-destructive-foreground/80'}`}>
            差異
          </div>
          <div className={`text-lg font-bold ${isPositive ? 'text-success-foreground' : 'text-destructive-foreground'}`}>
            {isPositive ? '+' : ''}{variance.toLocaleString()}{unit}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-success-foreground' : 'text-destructive-foreground'}`}>
            {isPositive ? '+' : ''}{variancePercent.toFixed(1)}%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">間接+終了実績:</span>
          <span className="ml-2 font-medium">{current.toLocaleString()}{unit}</span>
        </div>
        <div>
          <span className="text-muted-foreground">終了実績:</span>
          <span className="ml-2 font-medium">{current.toLocaleString()}{unit}</span>
        </div>
      </div>
    </div>
  );
};
