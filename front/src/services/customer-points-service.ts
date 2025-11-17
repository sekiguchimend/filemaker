// 顧客ポイントデータ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { CustomerPoints, PointTransaction } from '@/types/customer';

export interface CustomerPointsService extends BaseService {
  // 顧客ポイント一覧取得
  getCustomerPoints(): Promise<CustomerPoints[]>;
  
  // 顧客ポイント詳細取得
  getCustomerPointsById(customerId: string): Promise<CustomerPoints | null>;
  
  // ポイント履歴取得
  getPointHistory(customerId: string, startDate?: string, endDate?: string): Promise<PointTransaction[]>;
  
  // ポイント付与
  addPoints(customerId: string, points: number, reason: string): Promise<CustomerPoints>;
  
  // ポイント使用
  usePoints(customerId: string, points: number, reason: string): Promise<CustomerPoints>;
  
  // ポイント調整
  adjustPoints(customerId: string, points: number, reason: string): Promise<CustomerPoints>;
}

// APIサービス実装
class ApiCustomerPointsService implements CustomerPointsService {
  private readonly baseUrl = '/api/customer-points';

  async getCustomerPoints(): Promise<CustomerPoints[]> {
    try {
      return await apiRequest<CustomerPoints[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_020', '顧客ポイント一覧の取得に失敗しました');
    }
  }

  async getCustomerPointsById(customerId: string): Promise<CustomerPoints | null> {
    try {
      return await apiRequest<CustomerPoints>(`${this.baseUrl}/${customerId}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getPointHistory(customerId: string, startDate?: string, endDate?: string): Promise<PointTransaction[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<PointTransaction[]>(
        `${this.baseUrl}/${customerId}/history${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_021', 'ポイント履歴の取得に失敗しました');
    }
  }

  async addPoints(customerId: string, points: number, reason: string): Promise<CustomerPoints> {
    try {
      return await apiRequest<CustomerPoints>(`${this.baseUrl}/${customerId}/add`, {
        method: 'POST',
        body: JSON.stringify({ points, reason }),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_022', 'ポイント付与に失敗しました');
    }
  }

  async usePoints(customerId: string, points: number, reason: string): Promise<CustomerPoints> {
    try {
      return await apiRequest<CustomerPoints>(`${this.baseUrl}/${customerId}/use`, {
        method: 'POST',
        body: JSON.stringify({ points, reason }),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_023', 'ポイント使用に失敗しました');
    }
  }

  async adjustPoints(customerId: string, points: number, reason: string): Promise<CustomerPoints> {
    try {
      return await apiRequest<CustomerPoints>(`${this.baseUrl}/${customerId}/adjust`, {
        method: 'POST',
        body: JSON.stringify({ points, reason }),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_024', 'ポイント調整に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const customerPointsService: CustomerPointsService = new ApiCustomerPointsService();

