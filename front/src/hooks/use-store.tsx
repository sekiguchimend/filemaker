'use client';

// 店舗データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/services/store-service';
import { StoreBasicInfo } from '@/types';

// クエリキー定数
const QUERY_KEYS = {
  STORE_LIST: 'store-list',
  STORE_DETAIL: 'store-detail',
} as const;

// 店舗一覧取得フック
export function useStoreList() {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_LIST],
    queryFn: () => storeService.getStoreList(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 店舗詳細取得フック
export function useStoreById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_DETAIL, id],
    queryFn: () => storeService.getStoreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// 店舗作成ミューテーション
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (store: Omit<StoreBasicInfo, 'id' | 'createdAt' | 'updatedAt'>) =>
      storeService.createStore(store),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_LIST],
      });
    },
  });
}

// 店舗更新ミューテーション
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StoreBasicInfo> }) =>
      storeService.updateStore(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_DETAIL, variables.id],
      });
    },
  });
}

// 店舗削除ミューテーション
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_LIST],
      });
    },
  });
}

