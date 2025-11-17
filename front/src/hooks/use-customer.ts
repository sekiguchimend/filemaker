/**
 * Customer React Query Hooks
 * 顧客関連のReact Queryカスタムフック
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  customerService,
  CustomerFilters,
  CustomerVehicleFilters,
} from '@/services/customer-service';
import { PaginationParams } from '@/services/base-service';
import { Customer, CustomerVehicleInfo, GroupLedger } from '@/types/customer';

// クエリキー定義
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: CustomerFilters & PaginationParams) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  points: (customerId: string) => [...customerKeys.all, 'points', customerId] as const,
  vehicles: (filters?: CustomerVehicleFilters & PaginationParams) =>
    [...customerKeys.all, 'vehicles', filters] as const,
  groups: (filters?: PaginationParams & { status?: 'active' | 'inactive' }) =>
    [...customerKeys.all, 'groups', filters] as const,
};

/**
 * 顧客一覧取得
 */
export function useCustomers(filters?: CustomerFilters & PaginationParams) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customerService.getCustomers(filters),
  });
}

/**
 * 特定の顧客情報取得
 */
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
}

/**
 * 顧客ポイント情報取得
 */
export function useCustomerPoints(customerId: string) {
  return useQuery({
    queryKey: customerKeys.points(customerId),
    queryFn: () => customerService.getCustomerPoints(customerId),
    enabled: !!customerId,
  });
}

/**
 * 顧客車両情報一覧取得
 */
export function useCustomerVehicles(filters?: CustomerVehicleFilters & PaginationParams) {
  return useQuery({
    queryKey: customerKeys.vehicles(filters),
    queryFn: () => customerService.getCustomerVehicles(filters),
  });
}

/**
 * グループ台帳一覧取得
 */
export function useGroupLedger(
  filters?: PaginationParams & { status?: 'active' | 'inactive' }
) {
  return useQuery({
    queryKey: customerKeys.groups(filters),
    queryFn: () => customerService.getGroupLedger(filters),
  });
}

/**
 * 顧客作成ミューテーション
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Customer, 'id'>) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

/**
 * 顧客更新ミューテーション
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
    },
  });
}

/**
 * 顧客削除ミューテーション
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

/**
 * ポイント追加ミューテーション
 */
export function useAddPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      points,
      reason,
    }: {
      customerId: string;
      points: number;
      reason: string;
    }) => customerService.addPoints(customerId, points, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.points(variables.customerId),
      });
    },
  });
}

/**
 * ポイント使用ミューテーション
 */
export function useUsePoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      points,
      reason,
    }: {
      customerId: string;
      points: number;
      reason: string;
    }) => customerService.usePoints(customerId, points, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.points(variables.customerId),
      });
    },
  });
}

/**
 * 顧客車両作成ミューテーション
 */
export function useCreateCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CustomerVehicleInfo, 'id'>) =>
      customerService.createCustomerVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.vehicles() });
    },
  });
}

/**
 * 顧客車両更新ミューテーション
 */
export function useUpdateCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerVehicleInfo> }) =>
      customerService.updateCustomerVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.vehicles() });
    },
  });
}

/**
 * 顧客車両削除ミューテーション
 */
export function useDeleteCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomerVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.vehicles() });
    },
  });
}

/**
 * グループ台帳作成ミューテーション
 */
export function useCreateGroupLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<GroupLedger, 'id'>) =>
      customerService.createGroupLedger(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.groups() });
    },
  });
}

/**
 * グループ台帳更新ミューテーション
 */
export function useUpdateGroupLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GroupLedger> }) =>
      customerService.updateGroupLedger(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.groups() });
    },
  });
}
