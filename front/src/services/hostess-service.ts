/**
 * Hostess Service
 * ホステス関連のデータ操作を管理
 */

import { BaseService, PaginationParams, PaginatedResponse } from './base-service';
import {
  HostessLedger,
  HostessRanking,
  HostessManager,
  HostessScheduleData,
  TimeBasedHostessAttendance,
  WeeklyHostessAttendance,
} from '@/types/hostess';
import {
  sampleHostessLedger,
  sampleHostessRanking,
  sampleHostessManagers,
  sampleHostessScheduleData,
  sampleTimeBasedAttendance,
  sampleWeeklyAttendance,
} from '@/data/hostessSampleData';

export interface HostessFilters {
  storeId?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'retired';
  search?: string;
}

export interface HostessRankingFilters extends PaginationParams {
  storeId?: string;
  category?: string;
  month?: string;
}

export class HostessService extends BaseService {
  constructor() {
    super('/api/hostesses');
  }

  /**
   * ホステス台帳の一覧を取得
   */
  async getHostessLedger(
    filters?: HostessFilters & PaginationParams
  ): Promise<PaginatedResponse<HostessLedger>> {
    if (this.useMockData) {
      let filteredData = [...sampleHostessLedger];

      // フィルタリング処理
      if (filters?.status) {
        filteredData = filteredData.filter((h) => h.status === filters.status);
      }

      if (filters?.category) {
        filteredData = filteredData.filter((h) => h.category === filters.category);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (h) =>
            h.name.toLowerCase().includes(searchLower) ||
            h.stageName.toLowerCase().includes(searchLower) ||
            h.hostessNumber.toLowerCase().includes(searchLower)
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<HostessLedger>>('', filters);
  }

  /**
   * 特定のホステス情報を取得
   */
  async getHostessById(id: string): Promise<HostessLedger> {
    if (this.useMockData) {
      const hostess = sampleHostessLedger.find((h) => h.id === id);
      if (!hostess) {
        throw new Error(`Hostess with id ${id} not found`);
      }
      return hostess;
    }

    return this.get<HostessLedger>(`/${id}`);
  }

  /**
   * ホステス情報を作成
   */
  async createHostess(data: Omit<HostessLedger, 'id'>): Promise<HostessLedger> {
    if (this.useMockData) {
      const newHostess: HostessLedger = {
        ...data,
        id: `hostess${Date.now()}`,
      };
      sampleHostessLedger.push(newHostess);
      return newHostess;
    }

    return this.post<HostessLedger>('', data);
  }

  /**
   * ホステス情報を更新
   */
  async updateHostess(id: string, data: Partial<HostessLedger>): Promise<HostessLedger> {
    if (this.useMockData) {
      const index = sampleHostessLedger.findIndex((h) => h.id === id);
      if (index === -1) {
        throw new Error(`Hostess with id ${id} not found`);
      }
      sampleHostessLedger[index] = { ...sampleHostessLedger[index], ...data };
      return sampleHostessLedger[index];
    }

    return this.put<HostessLedger>(`/${id}`, data);
  }

  /**
   * ホステス情報を削除
   */
  async deleteHostess(id: string): Promise<void> {
    if (this.useMockData) {
      const index = sampleHostessLedger.findIndex((h) => h.id === id);
      if (index === -1) {
        throw new Error(`Hostess with id ${id} not found`);
      }
      sampleHostessLedger.splice(index, 1);
      return;
    }

    return this.delete(`/${id}`);
  }

  /**
   * ホステスランキングを取得
   */
  async getHostessRanking(
    filters?: HostessRankingFilters
  ): Promise<PaginatedResponse<HostessRanking>> {
    if (this.useMockData) {
      let filteredData = [...sampleHostessRanking];

      if (filters?.storeId) {
        filteredData = filteredData.filter((h) => h.storeId === filters.storeId);
      }

      if (filters?.category) {
        filteredData = filteredData.filter((h) => h.category === filters.category);
      }

      // ランキング順でソート
      filteredData.sort((a, b) => a.rank - b.rank);

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<HostessRanking>>('/ranking', filters);
  }

  /**
   * ホステスマネージャー一覧を取得
   */
  async getHostessManagers(
    filters?: PaginationParams
  ): Promise<PaginatedResponse<HostessManager>> {
    if (this.useMockData) {
      return this.createPaginatedResponse(sampleHostessManagers, filters);
    }

    return this.get<PaginatedResponse<HostessManager>>('/managers', filters);
  }

  /**
   * ホステススケジュールを取得
   */
  async getHostessSchedule(
    filters?: { weekStartDate?: string } & PaginationParams
  ): Promise<PaginatedResponse<HostessScheduleData>> {
    if (this.useMockData) {
      let filteredData = [...sampleHostessScheduleData];

      if (filters?.weekStartDate) {
        filteredData = filteredData.filter(
          (s) => s.weekStartDate === filters.weekStartDate
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<HostessScheduleData>>('/schedule', filters);
  }

  /**
   * ホステススケジュールを更新
   */
  async updateHostessSchedule(
    id: string,
    data: Partial<HostessScheduleData>
  ): Promise<HostessScheduleData> {
    if (this.useMockData) {
      const index = sampleHostessScheduleData.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Schedule with id ${id} not found`);
      }
      sampleHostessScheduleData[index] = {
        ...sampleHostessScheduleData[index],
        ...data,
      };
      return sampleHostessScheduleData[index];
    }

    return this.put<HostessScheduleData>(`/schedule/${id}`, data);
  }

  /**
   * 時間別ホステス出勤状況を取得
   */
  async getTimeBasedAttendance(date: string): Promise<TimeBasedHostessAttendance[]> {
    if (this.useMockData) {
      return sampleTimeBasedAttendance.filter((a) => a.date === date);
    }

    return this.get<TimeBasedHostessAttendance[]>('/attendance/time-based', { date });
  }

  /**
   * 週間ホステス出勤状況を取得
   */
  async getWeeklyAttendance(
    filters?: { weekStartDate?: string; weekEndDate?: string } & PaginationParams
  ): Promise<PaginatedResponse<WeeklyHostessAttendance>> {
    if (this.useMockData) {
      let filteredData = [...sampleWeeklyAttendance];

      if (filters?.weekStartDate) {
        filteredData = filteredData.filter(
          (a) => a.weekStartDate === filters.weekStartDate
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<WeeklyHostessAttendance>>(
      '/attendance/weekly',
      filters
    );
  }

  /**
   * ホステスの統計情報を取得
   */
  async getHostessStats(hostessId: string, period?: { from: string; to: string }) {
    if (this.useMockData) {
      // モックデータの場合は簡易的な統計を返す
      const hostess = sampleHostessLedger.find((h) => h.id === hostessId);
      if (!hostess) {
        throw new Error(`Hostess with id ${hostessId} not found`);
      }

      return {
        totalEarnings: hostess.totalEarnings,
        totalWorkDays: hostess.totalWorkDays,
        averageRating: hostess.averageRating,
        period: period || { from: '2025-01-01', to: '2025-01-31' },
      };
    }

    return this.get(`/${hostessId}/stats`, period);
  }
}

// シングルトンインスタンスをエクスポート
export const hostessService = new HostessService();
