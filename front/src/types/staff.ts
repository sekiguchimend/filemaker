/**
 * 雇用形態の型定義
 */
export type EmploymentType = 'employee' | 'part_time';

/**
 * 雇用形態の表示ラベル
 */
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  employee: '社員',
  part_time: 'アルバイト'
};

/**
 * スタッフリスト用ステータスの型定義
 */
export type StaffListStatus = '出勤' | '希望';

/**
 * スタッフの型定義
 */
export interface Staff {
  /** 雇用形態（employee: 社員, part_time: アルバイト） */
  employmentType: EmploymentType;
  /** スタッフ名 */
  staffName: string;
  /** ステータス（出勤または希望） */
  status: StaffListStatus;
  /** 数値 */
  numericValue: number;
  /** 金額1 */
  amount1: number;
  /** 金額2 */
  amount2: number;
  /** 金額3 */
  amount3: number;
}
