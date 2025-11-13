// new-rt2ページ用の型定義

// 出勤予定ホステス
export interface ScheduledHostess {
  id: string;
  hostessName: string; // ホステス名（例：「すすす」）
  driverName: string; // ドライバー名（例：「松尾」）
  location: string; // 場所（例：「南ICコイン」）
  area: string; // エリア（例：「南」）
  startTime: string; // 開始時間（例：「00:00」）
  endTime: string; // 終了時間（例：「00:00」）
  arrivalTime: string; // 到着時間（例：「00:00」）
  count: number; // 件数（例：1）
}

// INドラ未定予約リスト
export interface UndecidedDriverReservation {
  id: string;
  departureTime: string; // 出勤時間（例：「00:00」）
  isConfirmed: boolean; // 確認済みフラグ（「確」表示）
  pickupLocation: string; // 迎え場所（例：「南IC」）
  area: string; // エリア（例：「南」）
  hostessName: string; // ホステス名（例：「リョウナ」）
  sColumn: string; // S列（例：「S」）
  timeTotal: number; // 時間計（分）（例：120）
  isHighlighted: boolean; // ハイライト表示フラグ（背景色）
}

// ホステス送り・帰宅
export interface HostessTransport {
  id: string;
  hostessName: string; // ホステス名（例：「南 リョウナ」）
  departureTime: string; // 出発時間（例：「00:00」）
  destination: string; // 送り場所
  returnTime?: string; // 帰宅時間（オプション）
}

// 帰宅ホステス
export interface ReturningHostess {
  id: string;
  hostessName: string; // ホステス名
  returnTime: string; // 帰宅時間
  location: string; // 場所（例：「自宅or寮　待機」）
}

// 予定(打ち合わせ・撮影など)
export interface ScheduleItem {
  id: string;
  title: string; // タイトル（例：「ああああ」）
  description: string; // 説明（例：「ああああ」）
}

// 面接予定
export interface InterviewSchedule {
  id: string;
  title: string; // タイトル
  description: string; // 説明
}

// ドライバ配車パネル
export interface DriverDispatchPanel {
  id: string;
  status: 'completed' | 'pending'; // 済/未済
  type: 'entry' | 'other'; // 入店/その他
  time: string; // 時間
  location: string; // 場所（例：「セブンイレブン新町一条店」）
  hostessName1: string; // ホステス名1
  hostessName2?: string; // ホステス名2（オプション）
}

