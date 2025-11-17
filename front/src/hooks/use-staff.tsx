'use client';

// スタッフデータ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staff-service';
import { StaffLedgerRecord } from '@/types';

// クエリキー定数
const QUERY_KEYS = {
  STAFF_LEDGER: 'staff-ledger',
  STAFF_DETAIL: 'staff-detail',
} as const;

// スタッフ台帳一覧取得フック
export function useStaffLedger() {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF_LEDGER],
    queryFn: () => staffService.getStaffLedger(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// スタッフ詳細取得フック
export function useStaffById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF_DETAIL, id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// スタッフ作成ミューテーション
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staff: Omit<StaffLedgerRecord, 'id' | 'createdAt' | 'updatedAt'>) =>
      staffService.createStaff(staff),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAFF_LEDGER],
      });
    },
  });
}

// スタッフ更新ミューテーション
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StaffLedgerRecord> }) =>
      staffService.updateStaff(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAFF_LEDGER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAFF_DETAIL, variables.id],
      });
    },
  });
}

// スタッフ削除ミューテーション
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAFF_LEDGER],
      });
    },
  });
}

