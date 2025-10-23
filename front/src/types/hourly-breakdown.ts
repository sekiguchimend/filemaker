// 時間別内訳テーブル用の型

export interface HourlyData {
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


