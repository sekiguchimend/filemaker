// ホステスデータの型定義
export interface HostessSchedule {
  id: string;
  name: string; // ホステス名
  pickupDriver?: string; // 迎えドラ
  decision: number; // 決定
  workStart?: string; // 出勤時刻
  pickupLocation?: string; // 迎え場所
  workEnd?: string; // 終了時刻
  goHome?: string; // 帰宅時刻
}

// スタッフデータの型定義
export interface StaffSchedule {
  memo: string;
}

// 配車データの型定義
export interface DispatchData {
  id: string;
  number: string;
  customer: string;
  from: string;
  to: string;
  time: string;
  driver?: string;
  status: 'pending' | 'assigned' | 'completed';
  priority: 'normal' | 'high' | 'urgent';
}

// ドライバーデータの型定義
export interface DriverData {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: string;
  currentJob?: string;
}

// INドラ未定予約データの型定義
export interface InDriverPendingReservation {
  id: string;
  start: string; // 開始
  location: string; // 場所
  hostessName: string; // ホステス名
  timeTotal: string; // 時間計
  receipt: boolean; // 領収書
  waiting: boolean; // 待合せ
  arrivalCall: boolean; // 着TEL
  card: boolean; // カード
  option: boolean; // オプション
}

// ホステス送り・帰宅データの型定義
export interface HostessDelivery {
  id: string;
  luggage: '有' | '無'; // 荷物(2択)
  hostessName: string; // ホステス
  deliveryDriver: string; // 送りドラ
  endTime: string; // 終了
  homeTime: string; // 帰宅
  deliveryLocation: string; // 送り場所
  count: number; // 件数
}

// 郵便番号ベースの派遣地区別交通費データの型定義
export interface DispatchPostalCodeTransportFee {
  id: string;
  no: number; // No
  postalCodePrefix: string; // 上三桁(郵便番号7桁から先頭3桁)
  postalCode: string; // 郵便番号7桁
  prefectureReading: string; // 都道府県読み(半角カタカナ)
  cityReading: string; // 市区町村読み(半角カタカナ)
  townReading: string; // 町丁読み(半角カタカナ)
  prefecture: string; // 都道府県
  city: string; // 市区町村
  town: string; // 町丁
  transportFee: number; // 交通費
}

// 後方互換性のため、エイリアスを提供（非推奨）
/** @deprecated DispatchPostalCodeTransportFee を使用してください */
export type DispatchAreaTransportFee = DispatchPostalCodeTransportFee;
