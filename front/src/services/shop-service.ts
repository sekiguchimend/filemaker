// 店舗（shop）データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { Shop } from '@/types/shop';

export interface ShopService extends BaseService {
  // 店舗一覧取得
  getShopList(): Promise<Shop[]>;
  
  // 店舗詳細取得
  getShopById(id: string): Promise<Shop | null>;
}

// APIサービス実装
class ApiShopService implements ShopService {
  private readonly baseUrl = '/api/shops';

  async getShopList(): Promise<Shop[]> {
    try {
      return await apiRequest<Shop[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_009', '店舗一覧の取得に失敗しました');
    }
  }

  async getShopById(id: string): Promise<Shop | null> {
    try {
      return await apiRequest<Shop>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}

// サービスインスタンスをエクスポート
export const shopService: ShopService = new ApiShopService();

