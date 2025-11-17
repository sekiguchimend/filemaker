// スタッフデータ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { StaffLedgerRecord } from '@/types';

export interface StaffService extends BaseService {
  // スタッフ台帳一覧取得
  getStaffLedger(): Promise<StaffLedgerRecord[]>;
  
  // スタッフ詳細取得
  getStaffById(id: string): Promise<StaffLedgerRecord | null>;
  
  // スタッフ作成
  createStaff(staff: Omit<StaffLedgerRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffLedgerRecord>;
  
  // スタッフ更新
  updateStaff(id: string, updates: Partial<StaffLedgerRecord>): Promise<StaffLedgerRecord>;
  
  // スタッフ削除
  deleteStaff(id: string): Promise<boolean>;
}

// APIサービス実装
class ApiStaffService implements StaffService {
  private readonly baseUrl = '/api/staff-ledger';

  async getStaffLedger(): Promise<StaffLedgerRecord[]> {
    try {
      return await apiRequest<StaffLedgerRecord[]>(this.baseUrl, {
        cache: 'no-store',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_001', 'スタッフ台帳の取得に失敗しました');
    }
  }

  async getStaffById(id: string): Promise<StaffLedgerRecord | null> {
    try {
      return await apiRequest<StaffLedgerRecord>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createStaff(staff: Omit<StaffLedgerRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffLedgerRecord> {
    try {
      return await apiRequest<StaffLedgerRecord>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(staff),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_002', 'スタッフの作成に失敗しました');
    }
  }

  async updateStaff(id: string, updates: Partial<StaffLedgerRecord>): Promise<StaffLedgerRecord> {
    try {
      return await apiRequest<StaffLedgerRecord>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_003', 'スタッフの更新に失敗しました');
    }
  }

  async deleteStaff(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_004', 'スタッフの削除に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const staffService: StaffService = new ApiStaffService();

