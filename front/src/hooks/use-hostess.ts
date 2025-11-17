/**
 * Hostess React Query Hooks
 * ホステス関連のReact Queryカスタムフック
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hostessService, HostessFilters, HostessRankingFilters } from '@/services/hostess-service';
import { PaginationParams } from '@/services/base-service';
import { HostessLedger, HostessScheduleData } from '@/types/hostess';

// クエリキー定義
export const hostessKeys = {
  all: ['hostesses'] as const,
  lists: () => [...hostessKeys.all, 'list'] as const,
  list: (filters?: HostessFilters & PaginationParams) =>
    [...hostessKeys.lists(), filters] as const,
  details: () => [...hostessKeys.all, 'detail'] as const,
  detail: (id: string) => [...hostessKeys.details(), id] as const,
  ranking: (filters?: HostessRankingFilters) =>
    [...hostessKeys.all, 'ranking', filters] as const,
  managers: (filters?: PaginationParams) =>
    [...hostessKeys.all, 'managers', filters] as const,
  schedule: (filters?: { weekStartDate?: string } & PaginationParams) =>
    [...hostessKeys.all, 'schedule', filters] as const,
  timeBasedAttendance: (date: string) =>
    [...hostessKeys.all, 'time-based-attendance', date] as const,
  weeklyAttendance: (filters?: { weekStartDate?: string; weekEndDate?: string } & PaginationParams) =>
    [...hostessKeys.all, 'weekly-attendance', filters] as const,
  stats: (hostessId: string, period?: { from: string; to: string }) =>
    [...hostessKeys.all, 'stats', hostessId, period] as const,
};

/**
 * ホステス台帳一覧取得
 */
export function useHostessLedger(filters?: HostessFilters & PaginationParams) {
  return useQuery({
    queryKey: hostessKeys.list(filters),
    queryFn: () => hostessService.getHostessLedger(filters),
  });
}

/**
 * 特定のホステス情報取得
 */
export function useHostess(id: string) {
  return useQuery({
    queryKey: hostessKeys.detail(id),
    queryFn: () => hostessService.getHostessById(id),
    enabled: !!id,
  });
}

/**
 * ホステスランキング取得
 */
export function useHostessRanking(filters?: HostessRankingFilters) {
  return useQuery({
    queryKey: hostessKeys.ranking(filters),
    queryFn: () => hostessService.getHostessRanking(filters),
  });
}

/**
 * ホステスマネージャー一覧取得
 */
export function useHostessManagers(filters?: PaginationParams) {
  return useQuery({
    queryKey: hostessKeys.managers(filters),
    queryFn: () => hostessService.getHostessManagers(filters),
  });
}

/**
 * ホステススケジュール取得
 */
export function useHostessSchedule(filters?: { weekStartDate?: string } & PaginationParams) {
  return useQuery({
    queryKey: hostessKeys.schedule(filters),
    queryFn: () => hostessService.getHostessSchedule(filters),
  });
}

/**
 * 時間別ホステス出勤状況取得
 */
export function useTimeBasedAttendance(date: string) {
  return useQuery({
    queryKey: hostessKeys.timeBasedAttendance(date),
    queryFn: () => hostessService.getTimeBasedAttendance(date),
    enabled: !!date,
  });
}

/**
 * 週間ホステス出勤状況取得
 */
export function useWeeklyAttendance(
  filters?: { weekStartDate?: string; weekEndDate?: string } & PaginationParams
) {
  return useQuery({
    queryKey: hostessKeys.weeklyAttendance(filters),
    queryFn: () => hostessService.getWeeklyAttendance(filters),
  });
}

/**
 * ホステス統計情報取得
 */
export function useHostessStats(
  hostessId: string,
  period?: { from: string; to: string }
) {
  return useQuery({
    queryKey: hostessKeys.stats(hostessId, period),
    queryFn: () => hostessService.getHostessStats(hostessId, period),
    enabled: !!hostessId,
  });
}

/**
 * ホステス作成ミューテーション
 */
export function useCreateHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<HostessLedger, 'id'>) =>
      hostessService.createHostess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostessKeys.lists() });
    },
  });
}

/**
 * ホステス更新ミューテーション
 */
export function useUpdateHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HostessLedger> }) =>
      hostessService.updateHostess(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: hostessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hostessKeys.detail(variables.id) });
    },
  });
}

/**
 * ホステス削除ミューテーション
 */
export function useDeleteHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostessService.deleteHostess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostessKeys.lists() });
    },
  });
}

/**
 * ホステススケジュール更新ミューテーション
 */
export function useUpdateHostessSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HostessScheduleData> }) =>
      hostessService.updateHostessSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostessKeys.schedule() });
    },
  });
}
