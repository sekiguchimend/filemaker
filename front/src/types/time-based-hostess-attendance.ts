// 時間別ホステス出勤ページ用の型定義

export type HostessAttendanceTask = {
  id: string;
  hostessId: string;
  hostessName: string;
  start: string; // ISO string
  end: string; // ISO string
  location?: string;
  notes?: string;
};

export interface AttendanceDataItem {
  id?: string;
  startTime: string;
  endTime: string;
  hostessId?: string;
  hostessName?: string;
  location?: string;
  notes?: string;
  status?: string;
}


