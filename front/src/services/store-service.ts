// 店舗データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { StoreBasicInfo } from '@/types';

export interface StoreService extends BaseService {
  // 店舗一覧取得
  getStoreList(): Promise<StoreBasicInfo[]>;
  
  // 店舗詳細取得
  getStoreById(id: string): Promise<StoreBasicInfo | null>;
  
  // 店舗作成
  createStore(store: Omit<StoreBasicInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoreBasicInfo>;
  
  // 店舗更新
  updateStore(id: string, updates: Partial<StoreBasicInfo>): Promise<StoreBasicInfo>;
  
  // 店舗削除
  deleteStore(id: string): Promise<boolean>;
}

// APIサービス実装
class ApiStoreService implements StoreService {
  private readonly baseUrl = '/api/stores';

  async getStoreList(): Promise<StoreBasicInfo[]> {
    try {
      return await apiRequest<StoreBasicInfo[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_005', '店舗一覧の取得に失敗しました');
    }
  }

  async getStoreById(id: string): Promise<StoreBasicInfo | null> {
    try {
      return await apiRequest<StoreBasicInfo>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createStore(store: Omit<StoreBasicInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoreBasicInfo> {
    try {
      return await apiRequest<StoreBasicInfo>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(store),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_006', '店舗の作成に失敗しました');
    }
  }

  async updateStore(id: string, updates: Partial<StoreBasicInfo>): Promise<StoreBasicInfo> {
    try {
      return await apiRequest<StoreBasicInfo>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_007', '店舗の更新に失敗しました');
    }
  }

  async deleteStore(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_008', '店舗の削除に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const storeService: StoreService = new ApiStoreService();

