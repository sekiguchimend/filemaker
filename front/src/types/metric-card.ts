// MetricCard の Props 型

export interface MetricCardProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  subLabel?: string;
  colorScheme?: "default" | "success" | "neutral";
}


