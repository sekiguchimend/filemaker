// table UI components are not used; grid layout is used instead

interface HourlyData {
  time: string;
  sales: number;
  prevSales: number;
  target: number;
  variance: number;
  count1: number;
  count2: number;
  count3: number;
  variance2: number;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
}

const generateHourlyData = (): HourlyData[] => {
  const hours = [];
  for (let h = 9; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${h}:${m.toString().padStart(2, '0')}`;
      const baseSales = 300000 + Math.random() * 400000;
      const target = 1055204;
      
      hours.push({
        time,
        sales: Math.floor(baseSales),
        prevSales: Math.floor(baseSales * (0.9 + Math.random() * 0.2)),
        target,
        variance: -30 - Math.random() * 40,
        count1: Math.floor(50 + Math.random() * 80),
        count2: Math.floor(40 + Math.random() * 100),
        count3: 145 + Math.floor(Math.random() * 5),
        variance2: -10 - Math.random() * 30,
        value1: Math.floor(400 + Math.random() * 50),
        value2: Math.floor(50 + Math.random() * 150),
        value3: 68 + Math.floor(Math.random() * 3),
        value4: 60 + Math.floor(Math.random() * 10),
      });
    }
  }
  return hours;
};

export const HourlyBreakdownTable = () => {
  const data = generateHourlyData();

  return (
    <div className="h-full overflow-auto border rounded-md bg-card">
      <div className="sticky top-0 bg-card z-10 border-b">
        <div className="grid grid-cols-12 gap-1 p-2 text-xs font-medium">
          <div className="col-span-1">時間</div>
          <div className="col-span-2 text-center">売上金額 予計+実績</div>
          <div className="col-span-2 text-center">売上金額 実績</div>
          <div className="col-span-1 text-center">目標金額</div>
          <div className="col-span-1 text-center">達成率</div>
          <div className="col-span-1 text-center">売上件数</div>
          <div className="col-span-1 text-center">前年同月</div>
          <div className="col-span-1 text-center">目標件数</div>
          <div className="col-span-1 text-center">達成率</div>
          <div className="col-span-1 text-center">主菜単価</div>
        </div>
      </div>

      <div className="divide-y">
        {data.map((row, idx) => (
          <div 
            key={idx} 
            className="grid grid-cols-12 gap-1 p-2 text-xs hover:bg-muted/50 transition-colors"
          >
            <div className="col-span-1 font-medium">{row.time}</div>
            <div className="col-span-2 text-right font-mono">{row.sales.toLocaleString()}</div>
            <div className="col-span-2 text-right font-mono text-muted-foreground">
              {row.prevSales.toLocaleString()}
            </div>
            <div className="col-span-1 text-right font-mono text-primary">
              {row.target.toLocaleString()}
            </div>
            <div className={`col-span-1 text-right font-medium ${row.variance < 0 ? 'text-destructive' : 'text-success'}`}>
              {row.variance < 0 && '▲'}{Math.abs(row.variance).toFixed(1)}%
            </div>
            <div className="col-span-1 text-right font-mono">{row.count1}</div>
            <div className="col-span-1 text-right font-mono">{row.count2}</div>
            <div className="col-span-1 text-right font-mono">{row.count3}</div>
            <div className={`col-span-1 text-right font-medium ${row.variance2 < 0 ? 'text-destructive' : 'text-success'}`}>
              {row.variance2 < 0 && '▲'}{Math.abs(row.variance2).toFixed(1)}%
            </div>
            <div className="col-span-1 text-right font-mono">{row.value1.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
