'use client';

// 顧客車両情報データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerVehicleService } from '@/services/customer-vehicle-service';
import { CustomerVehicle } from '@/types/customer-vehicle';

// クエリキー定数
const QUERY_KEYS = {
  CUSTOMER_VEHICLES: 'customer-vehicles',
  CUSTOMER_VEHICLE_DETAIL: 'customer-vehicle-detail',
} as const;

// 顧客車両情報一覧取得フック
export function useCustomerVehicles() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_VEHICLES],
    queryFn: () => customerVehicleService.getCustomerVehicles(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 顧客車両情報詳細取得フック
export function useCustomerVehicleById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_VEHICLE_DETAIL, id],
    queryFn: () => customerVehicleService.getCustomerVehicleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// 顧客車両情報作成ミューテーション
export function useCreateCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicle: Omit<CustomerVehicle, 'id' | 'serialNumber'>) =>
      customerVehicleService.createCustomerVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_VEHICLES],
      });
    },
  });
}

// 顧客車両情報更新ミューテーション
export function useUpdateCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CustomerVehicle> }) =>
      customerVehicleService.updateCustomerVehicle(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_VEHICLES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_VEHICLE_DETAIL, variables.id],
      });
    },
  });
}

// 顧客車両情報削除ミューテーション
export function useDeleteCustomerVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerVehicleService.deleteCustomerVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_VEHICLES],
      });
    },
  });
}

