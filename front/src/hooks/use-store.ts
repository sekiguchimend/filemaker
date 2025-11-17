/**
 * Store React Query Hooks
 * 店舗関連のReact Queryカスタムフック
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService, StoreFilters } from '@/services/store-service';
import { PaginationParams } from '@/services/base-service';
import { StoreBasicInfo } from '@/types/store-ledger';

// クエリキー定義
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters?: StoreFilters & PaginationParams) =>
    [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  gmDivisions: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'gm-divisions', filters] as const,
  coursePrices: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'course-prices', filters] as const,
  courseFees: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'course-fees', filters] as const,
  specialPrices: (storeId: string, filters?: PaginationParams & { isActive?: boolean }) =>
    [...storeKeys.all, storeId, 'special-prices', filters] as const,
  staffComposition: (storeId: string, filters?: PaginationParams & { isActive?: boolean }) =>
    [...storeKeys.all, storeId, 'staff-composition', filters] as const,
  classPrices: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'class-prices', filters] as const,
  bonusCriteria: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'bonus-criteria', filters] as const,
  nominations: (storeId: string, filters?: PaginationParams & { isActive?: boolean }) =>
    [...storeKeys.all, storeId, 'nominations', filters] as const,
  attendance: (
    storeId: string,
    filters?: PaginationParams & { date?: string; staffId?: string }
  ) => [...storeKeys.all, storeId, 'attendance', filters] as const,
  communications: (
    storeId: string,
    filters?: PaginationParams & { toStaffId?: string; isRead?: boolean }
  ) => [...storeKeys.all, storeId, 'communications', filters] as const,
  salesData: (
    storeId: string,
    filters?: PaginationParams & { startDate?: string; endDate?: string }
  ) => [...storeKeys.all, storeId, 'sales-data', filters] as const,
  otherPoints: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'other-points', filters] as const,
  minusPoints: (storeId: string, filters?: PaginationParams & { isResolved?: boolean }) =>
    [...storeKeys.all, storeId, 'minus-points', filters] as const,
  customerPoints: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'customer-points', filters] as const,
  discounts: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'discounts', filters] as const,
  displaySettings: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'display-settings', filters] as const,
  media: (storeId: string, filters?: PaginationParams & { category?: string }) =>
    [...storeKeys.all, storeId, 'media', filters] as const,
  options: (storeId: string, filters?: PaginationParams) =>
    [...storeKeys.all, storeId, 'options', filters] as const,
};

/**
 * 店舗一覧取得
 */
export function useStores(filters?: StoreFilters & PaginationParams) {
  return useQuery({
    queryKey: storeKeys.list(filters),
    queryFn: () => storeService.getStores(filters),
  });
}

/**
 * 特定の店舗情報取得
 */
export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => storeService.getStoreById(id),
    enabled: !!id,
  });
}

/**
 * GM区分一覧取得
 */
export function useGMDivisions(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.gmDivisions(storeId, filters),
    queryFn: () => storeService.getGMDivisions(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * コース料金一覧取得
 */
export function useCoursePrices(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.coursePrices(storeId, filters),
    queryFn: () => storeService.getCoursePrices(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * コース料金（新）一覧取得
 */
export function useCourseFees(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.courseFees(storeId, filters),
    queryFn: () => storeService.getCourseFees(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 特別料金一覧取得
 */
export function useSpecialPrices(
  storeId: string,
  filters?: PaginationParams & { isActive?: boolean }
) {
  return useQuery({
    queryKey: storeKeys.specialPrices(storeId, filters),
    queryFn: () => storeService.getSpecialPrices(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 人事構成一覧取得
 */
export function useStaffComposition(
  storeId: string,
  filters?: PaginationParams & { isActive?: boolean }
) {
  return useQuery({
    queryKey: storeKeys.staffComposition(storeId, filters),
    queryFn: () => storeService.getStaffComposition(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * クラス別料金一覧取得
 */
export function useClassPrices(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.classPrices(storeId, filters),
    queryFn: () => storeService.getClassPrices(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * ボーナス支給基準一覧取得
 */
export function useBonusCriteria(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.bonusCriteria(storeId, filters),
    queryFn: () => storeService.getBonusCriteria(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 指名一覧取得
 */
export function useNominations(
  storeId: string,
  filters?: PaginationParams & { isActive?: boolean }
) {
  return useQuery({
    queryKey: storeKeys.nominations(storeId, filters),
    queryFn: () => storeService.getNominations(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 出勤記録一覧取得
 */
export function useAttendance(
  storeId: string,
  filters?: PaginationParams & { date?: string; staffId?: string }
) {
  return useQuery({
    queryKey: storeKeys.attendance(storeId, filters),
    queryFn: () => storeService.getAttendance(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 連絡一覧取得
 */
export function useCommunications(
  storeId: string,
  filters?: PaginationParams & { toStaffId?: string; isRead?: boolean }
) {
  return useQuery({
    queryKey: storeKeys.communications(storeId, filters),
    queryFn: () => storeService.getCommunications(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 売上データ一覧取得
 */
export function useSalesData(
  storeId: string,
  filters?: PaginationParams & { startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: storeKeys.salesData(storeId, filters),
    queryFn: () => storeService.getSalesData(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * その他ポイント一覧取得
 */
export function useOtherPoints(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.otherPoints(storeId, filters),
    queryFn: () => storeService.getOtherPoints(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * マイナスポイント一覧取得
 */
export function useMinusPoints(
  storeId: string,
  filters?: PaginationParams & { isResolved?: boolean }
) {
  return useQuery({
    queryKey: storeKeys.minusPoints(storeId, filters),
    queryFn: () => storeService.getMinusPoints(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 顧客ポイント一覧取得
 */
export function useCustomerPoints(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.customerPoints(storeId, filters),
    queryFn: () => storeService.getCustomerPoints(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 割引一覧取得
 */
export function useDiscounts(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.discounts(storeId, filters),
    queryFn: () => storeService.getDiscounts(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 表示設定一覧取得
 */
export function useDisplaySettings(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.displaySettings(storeId, filters),
    queryFn: () => storeService.getDisplaySettings(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * メディア一覧取得
 */
export function useMedia(
  storeId: string,
  filters?: PaginationParams & { category?: string }
) {
  return useQuery({
    queryKey: storeKeys.media(storeId, filters),
    queryFn: () => storeService.getMedia(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * オプション一覧取得
 */
export function useOptions(storeId: string, filters?: PaginationParams) {
  return useQuery({
    queryKey: storeKeys.options(storeId, filters),
    queryFn: () => storeService.getOptions(storeId, filters),
    enabled: !!storeId,
  });
}

/**
 * 店舗作成ミューテーション
 */
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<StoreBasicInfo, 'id'>) => storeService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
}

/**
 * 店舗更新ミューテーション
 */
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StoreBasicInfo> }) =>
      storeService.updateStore(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(variables.id) });
    },
  });
}
