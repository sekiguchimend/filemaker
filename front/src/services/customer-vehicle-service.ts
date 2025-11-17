// 顧客車両情報データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { CustomerVehicle } from '@/types/customer-vehicle';

export interface CustomerVehicleService extends BaseService {
  // 顧客車両情報一覧取得
  getCustomerVehicles(): Promise<CustomerVehicle[]>;
  
  // 顧客車両情報詳細取得
  getCustomerVehicleById(id: string): Promise<CustomerVehicle | null>;
  
  // 顧客車両情報作成
  createCustomerVehicle(vehicle: Omit<CustomerVehicle, 'id' | 'serialNumber'>): Promise<CustomerVehicle>;
  
  // 顧客車両情報更新
  updateCustomerVehicle(id: string, updates: Partial<CustomerVehicle>): Promise<CustomerVehicle>;
  
  // 顧客車両情報削除
  deleteCustomerVehicle(id: string): Promise<boolean>;
}

// APIサービス実装
class ApiCustomerVehicleService implements CustomerVehicleService {
  private readonly baseUrl = '/api/customer-vehicles';

  async getCustomerVehicles(): Promise<CustomerVehicle[]> {
    try {
      return await apiRequest<CustomerVehicle[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_025', '顧客車両情報一覧の取得に失敗しました');
    }
  }

  async getCustomerVehicleById(id: string): Promise<CustomerVehicle | null> {
    try {
      return await apiRequest<CustomerVehicle>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createCustomerVehicle(vehicle: Omit<CustomerVehicle, 'id' | 'serialNumber'>): Promise<CustomerVehicle> {
    try {
      return await apiRequest<CustomerVehicle>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(vehicle),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_026', '顧客車両情報の作成に失敗しました');
    }
  }

  async updateCustomerVehicle(id: string, updates: Partial<CustomerVehicle>): Promise<CustomerVehicle> {
    try {
      return await apiRequest<CustomerVehicle>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_027', '顧客車両情報の更新に失敗しました');
    }
  }

  async deleteCustomerVehicle(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_028', '顧客車両情報の削除に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const customerVehicleService: CustomerVehicleService = new ApiCustomerVehicleService();

