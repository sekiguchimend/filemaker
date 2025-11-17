// 顧客データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { Customer } from '@/types';
import { Vehicle, UsageHistory } from '@/types/customer-ledger';

export interface CustomerService extends BaseService {
  // 顧客一覧取得
  getCustomers(): Promise<Customer[]>;
  
  // 顧客詳細取得
  getCustomerById(id: string): Promise<Customer | null>;
  
  // 顧客検索
  searchCustomers(query: string): Promise<Customer[]>;
  
  // 顧客作成
  createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer>;
  
  // 顧客更新
  updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer>;
  
  // 顧客削除
  deleteCustomer(id: string): Promise<boolean>;
  
  // 顧客の車両情報取得
  getCustomerVehicles(customerId: string): Promise<Vehicle[]>;
  
  // 顧客の利用履歴取得
  getCustomerUsageHistory(customerId: string, startDate?: string, endDate?: string): Promise<UsageHistory[]>;
}

// APIサービス実装
class ApiCustomerService implements CustomerService {
  private readonly baseUrl = '/api/customers';

  async getCustomers(): Promise<Customer[]> {
    try {
      return await apiRequest<Customer[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_013', '顧客一覧の取得に失敗しました');
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      return await apiRequest<Customer>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      return await apiRequest<Customer[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_014', '顧客検索に失敗しました');
    }
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      return await apiRequest<Customer>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(customer),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_015', '顧客の作成に失敗しました');
    }
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      return await apiRequest<Customer>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_016', '顧客の更新に失敗しました');
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_017', '顧客の削除に失敗しました');
    }
  }

  async getCustomerVehicles(customerId: string): Promise<Vehicle[]> {
    try {
      return await apiRequest<Vehicle[]>(`${this.baseUrl}/${customerId}/vehicles`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_018', '車両情報の取得に失敗しました');
    }
  }

  async getCustomerUsageHistory(customerId: string, startDate?: string, endDate?: string): Promise<UsageHistory[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<UsageHistory[]>(
        `${this.baseUrl}/${customerId}/usage-history${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_019', '利用履歴の取得に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const customerService: CustomerService = new ApiCustomerService();

