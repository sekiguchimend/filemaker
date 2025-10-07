import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateChartData = () => {
  const data = [];
  for (let i = 1; i <= 31; i++) {
    const baseActual = 900000 + Math.random() * 300000;
    const baseTarget = 600000 + Math.random() * 200000;
    data.push({
      date: `08月${i}日`,
      actual: Math.floor(baseActual),
      target: Math.floor(baseTarget),
    });
  }
  return data;
};

export const TrendChart = () => {
  const data = generateChartData();

  return (
    <div className="bg-card rounded-lg p-4 border">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            interval={2}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.25rem'
            }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="売上金額予計+実績"
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="売上金額目標"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
