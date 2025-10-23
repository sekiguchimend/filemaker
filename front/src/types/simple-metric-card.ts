// SimpleMetricCard の Props 型

export interface SimpleMetricCardProps {
  label: string;
  subLabel?: string;
  value: number;
  actual: number;
  target: number;
  unit?: string;
  bgColor?: string;
}


