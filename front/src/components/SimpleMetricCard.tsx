import { Card } from "@/components/ui/card";
import type { SimpleMetricCardProps } from '@/types/simple-metric-card';

export const SimpleMetricCard = ({ 
  label, 
  subLabel, 
  value, 
  actual, 
  target, 
  unit = "",
  bgColor = "bg-warning/10"
}: SimpleMetricCardProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      {subLabel && <div className="text-xs text-muted-foreground">{subLabel}</div>}
      
      <div className="grid grid-cols-4 gap-2 items-center">
        <Card className={`p-3 ${bgColor} border-0`}>
          <div className="text-xs text-muted-foreground mb-1">予定+出勤</div>
          <div className="text-lg font-bold">
            {value.toFixed(1)}{unit}
          </div>
        </Card>

        <div className="text-2xl font-bold text-muted-foreground">/</div>

        <Card className="p-3 bg-card border">
          <div className="text-xs text-muted-foreground mb-1">実績</div>
          <div className="text-lg font-bold">
            {actual}{unit}
          </div>
        </Card>

        <div className="text-2xl font-bold">=</div>
      </div>

      <div className="flex gap-4">
        <Card className="p-3 bg-muted border-0 flex-1">
          <div className="text-xs text-muted-foreground mb-1">予定+出勤</div>
          <div className="text-base font-bold">{value.toFixed(1)}{unit}</div>
        </Card>
        
        <Card className="p-3 bg-primary border-0 flex-1">
          <div className="text-xs text-primary-foreground/80 mb-1">目標</div>
          <div className="text-base font-bold text-primary-foreground">{target.toFixed(1)}{unit}</div>
        </Card>
      </div>
    </div>
  );
};
