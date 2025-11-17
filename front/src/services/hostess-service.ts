// ホステスデータ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { HostessLedger, HostessRanking, HostessManager } from '@/types/hostess';
import { HostessScheduleData } from '@/types/hostess';

export interface HostessService extends BaseService {
  // ホステス台帳一覧取得
  getHostessLedger(): Promise<HostessLedger[]>;
  
  // ホステス詳細取得
  getHostessById(id: string): Promise<HostessLedger | null>;
  
  // ホステス作成
  createHostess(hostess: Omit<HostessLedger, 'id'>): Promise<HostessLedger>;
  
  // ホステス更新
  updateHostess(id: string, updates: Partial<HostessLedger>): Promise<HostessLedger>;
  
  // ホステス削除
  deleteHostess(id: string): Promise<boolean>;
  
  // ホステスランキング取得
  getHostessRanking(period?: 'monthly' | 'weekly' | 'yearly', startDate?: string, endDate?: string): Promise<HostessRanking[]>;
  
  // ホステスマネージャー一覧取得
  getHostessManagers(): Promise<HostessManager[]>;
  
  // ホステススケジュール取得
  getHostessSchedules(weekStartDate: string, weekEndDate: string): Promise<HostessScheduleData[]>;
  
  // ホステススケジュール更新
  updateHostessSchedule(id: string, schedule: Partial<HostessScheduleData>): Promise<HostessScheduleData>;
}

// APIサービス実装
class ApiHostessService implements HostessService {
  private readonly baseUrl = '/api/hostesses';

  async getHostessLedger(): Promise<HostessLedger[]> {
    try {
      return await apiRequest<HostessLedger[]>(this.baseUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_029', 'ホステス台帳一覧の取得に失敗しました');
    }
  }

  async getHostessById(id: string): Promise<HostessLedger | null> {
    try {
      return await apiRequest<HostessLedger>(`${this.baseUrl}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createHostess(hostess: Omit<HostessLedger, 'id'>): Promise<HostessLedger> {
    try {
      return await apiRequest<HostessLedger>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(hostess),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_030', 'ホステスの作成に失敗しました');
    }
  }

  async updateHostess(id: string, updates: Partial<HostessLedger>): Promise<HostessLedger> {
    try {
      return await apiRequest<HostessLedger>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_031', 'ホステスの更新に失敗しました');
    }
  }

  async deleteHostess(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_032', 'ホステスの削除に失敗しました');
    }
  }

  async getHostessRanking(period: 'monthly' | 'weekly' | 'yearly' = 'monthly', startDate?: string, endDate?: string): Promise<HostessRanking[]> {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      return await apiRequest<HostessRanking[]>(`${this.baseUrl}/ranking?${params.toString()}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_033', 'ホステスランキングの取得に失敗しました');
    }
  }

  async getHostessManagers(): Promise<HostessManager[]> {
    try {
      return await apiRequest<HostessManager[]>(`${this.baseUrl}/managers`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_034', 'ホステスマネージャー一覧の取得に失敗しました');
    }
  }

  async getHostessSchedules(weekStartDate: string, weekEndDate: string): Promise<HostessScheduleData[]> {
    try {
      return await apiRequest<HostessScheduleData[]>(
        `${this.baseUrl}/schedules?weekStartDate=${weekStartDate}&weekEndDate=${weekEndDate}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_035', 'ホステススケジュールの取得に失敗しました');
    }
  }

  async updateHostessSchedule(id: string, schedule: Partial<HostessScheduleData>): Promise<HostessScheduleData> {
    try {
      return await apiRequest<HostessScheduleData>(`${this.baseUrl}/schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(schedule),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_036', 'ホステススケジュールの更新に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const hostessService: HostessService = new ApiHostessService();

