/**
 * Staff React Query Hooks
 * スタッフ・従業員関連のReact Queryカスタムフック
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  staffService,
  StaffFilters,
  SalaryFilters,
  ScheduleFilters,
} from '@/services/staff-service';
import { PaginationParams } from '@/services/base-service';
import {
  StaffLedger,
  EmployeeSchedule,
  EmployeeWeeklyShift,
} from '@/types/employee';
import { StaffAttendanceData } from '@/types/staff-attendance';

// クエリキー定義
export const staffKeys = {
  all: ['staff'] as const,
  ledger: (filters?: StaffFilters & PaginationParams) =>
    [...staffKeys.all, 'ledger', filters] as const,
  detail: (id: string) => [...staffKeys.all, 'detail', id] as const,
  employeeSalaries: (filters?: SalaryFilters & PaginationParams) =>
    [...staffKeys.all, 'employee-salaries', filters] as const,
  partTimeSalaries: (filters?: SalaryFilters & PaginationParams) =>
    [...staffKeys.all, 'part-time-salaries', filters] as const,
  schedules: (filters?: ScheduleFilters & PaginationParams) =>
    [...staffKeys.all, 'schedules', filters] as const,
  weeklyShifts: (filters?: { weekStartDate?: string } & PaginationParams) =>
    [...staffKeys.all, 'weekly-shifts', filters] as const,
  attendance: (filters?: { date?: string } & PaginationParams) =>
    [...staffKeys.all, 'attendance', filters] as const,
  stats: (staffId: string, period?: { from: string; to: string }) =>
    [...staffKeys.all, 'stats', staffId, period] as const,
};

/**
 * スタッフ台帳一覧取得
 */
export function useStaffLedger(filters?: StaffFilters & PaginationParams) {
  return useQuery({
    queryKey: staffKeys.ledger(filters),
    queryFn: () => staffService.getStaffLedger(filters),
  });
}

/**
 * 特定のスタッフ情報取得
 */
export function useStaff(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
  });
}

/**
 * 従業員給与一覧取得
 */
export function useEmployeeSalaries(filters?: SalaryFilters & PaginationParams) {
  return useQuery({
    queryKey: staffKeys.employeeSalaries(filters),
    queryFn: () => staffService.getEmployeeSalaries(filters),
  });
}

/**
 * パートタイム給与一覧取得
 */
export function usePartTimeSalaries(filters?: SalaryFilters & PaginationParams) {
  return useQuery({
    queryKey: staffKeys.partTimeSalaries(filters),
    queryFn: () => staffService.getPartTimeSalaries(filters),
  });
}

/**
 * 従業員スケジュール一覧取得
 */
export function useEmployeeSchedules(filters?: ScheduleFilters & PaginationParams) {
  return useQuery({
    queryKey: staffKeys.schedules(filters),
    queryFn: () => staffService.getEmployeeSchedules(filters),
  });
}

/**
 * 週間シフト一覧取得
 */
export function useWeeklyShifts(
  filters?: { weekStartDate?: string } & PaginationParams
) {
  return useQuery({
    queryKey: staffKeys.weeklyShifts(filters),
    queryFn: () => staffService.getWeeklyShifts(filters),
  });
}

/**
 * スタッフ出勤管理データ取得
 */
export function useStaffAttendance(filters?: { date?: string } & PaginationParams) {
  return useQuery({
    queryKey: staffKeys.attendance(filters),
    queryFn: () => staffService.getStaffAttendance(filters),
  });
}

/**
 * スタッフ統計情報取得
 */
export function useStaffStats(staffId: string, period?: { from: string; to: string }) {
  return useQuery({
    queryKey: staffKeys.stats(staffId, period),
    queryFn: () => staffService.getStaffStats(staffId, period),
    enabled: !!staffId,
  });
}

/**
 * スタッフ作成ミューテーション
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<StaffLedger, 'id'>) => staffService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.ledger() });
    },
  });
}

/**
 * スタッフ更新ミューテーション
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffLedger> }) =>
      staffService.updateStaff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.ledger() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
    },
  });
}

/**
 * 従業員スケジュール作成ミューテーション
 */
export function useCreateEmployeeSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<EmployeeSchedule, 'id'>) =>
      staffService.createEmployeeSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.schedules() });
    },
  });
}

/**
 * 従業員スケジュール更新ミューテーション
 */
export function useUpdateEmployeeSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeSchedule> }) =>
      staffService.updateEmployeeSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.schedules() });
    },
  });
}

/**
 * 週間シフト更新ミューテーション
 */
export function useUpdateWeeklyShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeWeeklyShift> }) =>
      staffService.updateWeeklyShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.weeklyShifts() });
    },
  });
}

/**
 * スタッフ出勤情報更新ミューテーション
 */
export function useUpdateStaffAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffAttendanceData> }) =>
      staffService.updateStaffAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.attendance() });
    },
  });
}
