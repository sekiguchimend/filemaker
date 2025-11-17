// 会計データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { AccountingSummary, IncomeSlip, ExpenseSlip, SalesSlip } from '@/types/accounting';

export interface AccountingService extends BaseService {
  // 会計集計データ取得
  getAccountingSummary(startDate?: string, endDate?: string): Promise<AccountingSummary[]>;
  
  // 収支伝票取得
  getIncomeSlips(startDate?: string, endDate?: string): Promise<IncomeSlip[]>;
  
  // 支出伝票取得
  getExpenseSlips(startDate?: string, endDate?: string): Promise<ExpenseSlip[]>;
  
  // 売上伝票取得
  getSalesSlips(startDate?: string, endDate?: string): Promise<SalesSlip[]>;
}

// APIサービス実装
class ApiAccountingService implements AccountingService {
  private readonly baseUrl = '/api/accounting';

  async getAccountingSummary(startDate?: string, endDate?: string): Promise<AccountingSummary[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<AccountingSummary[]>(
        `${this.baseUrl}/summary${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_009', '会計集計データの取得に失敗しました');
    }
  }

  async getIncomeSlips(startDate?: string, endDate?: string): Promise<IncomeSlip[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<IncomeSlip[]>(
        `${this.baseUrl}/income${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_010', '収支伝票の取得に失敗しました');
    }
  }

  async getExpenseSlips(startDate?: string, endDate?: string): Promise<ExpenseSlip[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<ExpenseSlip[]>(
        `${this.baseUrl}/expense${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_011', '支出伝票の取得に失敗しました');
    }
  }

  async getSalesSlips(startDate?: string, endDate?: string): Promise<SalesSlip[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await apiRequest<SalesSlip[]>(
        `${this.baseUrl}/sales${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_012', '売上伝票の取得に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const accountingService: AccountingService = new ApiAccountingService();

