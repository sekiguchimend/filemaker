export interface AreaDivision {
  no: number;
  wideArea: string;
  hiraganaReading: string;
  romanReading: string;
  areaCategory: string;
  administrativeDivision: string;
  addressCity: string;
  // 通称（基本住所表示マーカー）。最大2件を想定。
  addressNicknames?: string[];
  totalHotels: number;
  loveHotels: number;
  cityHotels: number;
}
