/**
 * Store Service
 * 店舗関連のデータ操作を管理
 */

import { BaseService, PaginationParams, PaginatedResponse } from './base-service';
import {
  StoreBasicInfo,
  GMDivision,
  CoursePrice,
  CourseFee,
  SpecialPrice,
  StaffComposition,
  ClassPrice,
  BonusCriteria,
  Nomination,
  Attendance,
  Communication,
  SalesData,
  OtherPoints,
  MinusPoints,
  StoreCustomerPoints,
  Discount,
  DisplaySettings,
  Media,
  StoreOptions,
} from '@/types/store-ledger';
import {
  storeBasicInfoSampleData,
  gmDivisionSampleData,
  coursePriceSampleData,
  courseFeeSampleData,
  specialPriceSampleData,
  staffCompositionSampleData,
  classPriceSampleData,
  bonusCriteriaSampleData,
  nominationSampleData,
  attendanceSampleData,
  communicationSampleData,
  salesDataSampleData,
  otherPointsSampleData,
  minusPointsSampleData,
  customerPointsSampleData,
  discountSampleData,
  displaySettingsSampleData,
  mediaSampleData,
  storeOptionsSampleData,
} from '@/data/storeLedgerSampleData';

export interface StoreFilters {
  isActive?: boolean;
  search?: string;
}

export class StoreService extends BaseService {
  constructor() {
    super('/api/stores');
  }

  /**
   * 店舗基本情報一覧を取得
   */
  async getStores(
    filters?: StoreFilters & PaginationParams
  ): Promise<PaginatedResponse<StoreBasicInfo>> {
    if (this.useMockData) {
      let filteredData = [...storeBasicInfoSampleData];

      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter((s) => s.isActive === filters.isActive);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (s) =>
            s.storeName.toLowerCase().includes(searchLower) ||
            s.storeCode.toLowerCase().includes(searchLower)
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StoreBasicInfo>>('', filters);
  }

  /**
   * 特定の店舗情報を取得
   */
  async getStoreById(id: string): Promise<StoreBasicInfo> {
    if (this.useMockData) {
      const store = storeBasicInfoSampleData.find((s) => s.id === id);
      if (!store) {
        throw new Error(`Store with id ${id} not found`);
      }
      return store;
    }

    return this.get<StoreBasicInfo>(`/${id}`);
  }

  /**
   * 店舗情報を作成
   */
  async createStore(data: Omit<StoreBasicInfo, 'id'>): Promise<StoreBasicInfo> {
    if (this.useMockData) {
      const newStore: StoreBasicInfo = {
        ...data,
        id: `store${Date.now()}`,
      };
      storeBasicInfoSampleData.push(newStore);
      return newStore;
    }

    return this.post<StoreBasicInfo>('', data);
  }

  /**
   * 店舗情報を更新
   */
  async updateStore(id: string, data: Partial<StoreBasicInfo>): Promise<StoreBasicInfo> {
    if (this.useMockData) {
      const index = storeBasicInfoSampleData.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Store with id ${id} not found`);
      }
      storeBasicInfoSampleData[index] = { ...storeBasicInfoSampleData[index], ...data };
      return storeBasicInfoSampleData[index];
    }

    return this.put<StoreBasicInfo>(`/${id}`, data);
  }

  /**
   * GM区分一覧を取得
   */
  async getGMDivisions(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<GMDivision>> {
    if (this.useMockData) {
      const filteredData = gmDivisionSampleData.filter((g) => g.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<GMDivision>>(`/${storeId}/gm-divisions`, filters);
  }

  /**
   * コース料金一覧を取得
   */
  async getCoursePrices(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<CoursePrice>> {
    if (this.useMockData) {
      const filteredData = coursePriceSampleData.filter((c) => c.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<CoursePrice>>(`/${storeId}/course-prices`, filters);
  }

  /**
   * コース料金（新）一覧を取得
   */
  async getCourseFees(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<CourseFee>> {
    if (this.useMockData) {
      const filteredData = courseFeeSampleData.filter((c) => c.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<CourseFee>>(`/${storeId}/course-fees`, filters);
  }

  /**
   * 特別料金一覧を取得
   */
  async getSpecialPrices(
    storeId: string,
    filters?: PaginationParams & { isActive?: boolean }
  ): Promise<PaginatedResponse<SpecialPrice>> {
    if (this.useMockData) {
      let filteredData = specialPriceSampleData.filter((s) => s.storeId === storeId);

      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter((s) => s.isActive === filters.isActive);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<SpecialPrice>>(
      `/${storeId}/special-prices`,
      filters
    );
  }

  /**
   * 人事構成一覧を取得
   */
  async getStaffComposition(
    storeId: string,
    filters?: PaginationParams & { isActive?: boolean }
  ): Promise<PaginatedResponse<StaffComposition>> {
    if (this.useMockData) {
      let filteredData = staffCompositionSampleData.filter((s) => s.storeId === storeId);

      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter((s) => s.isActive === filters.isActive);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StaffComposition>>(
      `/${storeId}/staff-composition`,
      filters
    );
  }

  /**
   * クラス別料金一覧を取得
   */
  async getClassPrices(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<ClassPrice>> {
    if (this.useMockData) {
      const filteredData = classPriceSampleData.filter((c) => c.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<ClassPrice>>(`/${storeId}/class-prices`, filters);
  }

  /**
   * ボーナス支給基準一覧を取得
   */
  async getBonusCriteria(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<BonusCriteria>> {
    if (this.useMockData) {
      const filteredData = bonusCriteriaSampleData.filter((b) => b.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<BonusCriteria>>(
      `/${storeId}/bonus-criteria`,
      filters
    );
  }

  /**
   * 指名一覧を取得
   */
  async getNominations(
    storeId: string,
    filters?: PaginationParams & { isActive?: boolean }
  ): Promise<PaginatedResponse<Nomination>> {
    if (this.useMockData) {
      let filteredData = nominationSampleData.filter((n) => n.storeId === storeId);

      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter((n) => n.isActive === filters.isActive);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Nomination>>(`/${storeId}/nominations`, filters);
  }

  /**
   * 出勤記録一覧を取得
   */
  async getAttendance(
    storeId: string,
    filters?: PaginationParams & { date?: string; staffId?: string }
  ): Promise<PaginatedResponse<Attendance>> {
    if (this.useMockData) {
      let filteredData = attendanceSampleData.filter((a) => a.storeId === storeId);

      if (filters?.date) {
        filteredData = filteredData.filter((a) => a.date === filters.date);
      }

      if (filters?.staffId) {
        filteredData = filteredData.filter((a) => a.staffId === filters.staffId);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Attendance>>(`/${storeId}/attendance`, filters);
  }

  /**
   * 連絡一覧を取得
   */
  async getCommunications(
    storeId: string,
    filters?: PaginationParams & { toStaffId?: string; isRead?: boolean }
  ): Promise<PaginatedResponse<Communication>> {
    if (this.useMockData) {
      let filteredData = communicationSampleData.filter((c) => c.storeId === storeId);

      if (filters?.toStaffId) {
        filteredData = filteredData.filter((c) => c.toStaffId === filters.toStaffId);
      }

      if (filters?.isRead !== undefined) {
        filteredData = filteredData.filter((c) => c.isRead === filters.isRead);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Communication>>(
      `/${storeId}/communications`,
      filters
    );
  }

  /**
   * 売上データ一覧を取得
   */
  async getSalesData(
    storeId: string,
    filters?: PaginationParams & { startDate?: string; endDate?: string }
  ): Promise<PaginatedResponse<SalesData>> {
    if (this.useMockData) {
      let filteredData = salesDataSampleData.filter((s) => s.storeId === storeId);

      if (filters?.startDate) {
        filteredData = filteredData.filter((s) => s.date >= filters.startDate!);
      }

      if (filters?.endDate) {
        filteredData = filteredData.filter((s) => s.date <= filters.endDate!);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<SalesData>>(`/${storeId}/sales-data`, filters);
  }

  /**
   * その他ポイント一覧を取得
   */
  async getOtherPoints(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<OtherPoints>> {
    if (this.useMockData) {
      const filteredData = otherPointsSampleData.filter((o) => o.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<OtherPoints>>(`/${storeId}/other-points`, filters);
  }

  /**
   * マイナスポイント一覧を取得
   */
  async getMinusPoints(
    storeId: string,
    filters?: PaginationParams & { isResolved?: boolean }
  ): Promise<PaginatedResponse<MinusPoints>> {
    if (this.useMockData) {
      let filteredData = minusPointsSampleData.filter((m) => m.storeId === storeId);

      if (filters?.isResolved !== undefined) {
        filteredData = filteredData.filter((m) => m.isResolved === filters.isResolved);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<MinusPoints>>(`/${storeId}/minus-points`, filters);
  }

  /**
   * 顧客ポイント一覧を取得
   */
  async getCustomerPoints(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<StoreCustomerPoints>> {
    if (this.useMockData) {
      const filteredData = customerPointsSampleData.filter(
        (c) => c.storeId === storeId
      );
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StoreCustomerPoints>>(
      `/${storeId}/customer-points`,
      filters
    );
  }

  /**
   * 割引一覧を取得
   */
  async getDiscounts(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<Discount>> {
    if (this.useMockData) {
      const filteredData = discountSampleData.filter((d) => d.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Discount>>(`/${storeId}/discounts`, filters);
  }

  /**
   * 表示設定一覧を取得
   */
  async getDisplaySettings(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<DisplaySettings>> {
    if (this.useMockData) {
      const filteredData = displaySettingsSampleData.filter(
        (d) => d.storeId === storeId
      );
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<DisplaySettings>>(
      `/${storeId}/display-settings`,
      filters
    );
  }

  /**
   * メディア一覧を取得
   */
  async getMedia(
    storeId: string,
    filters?: PaginationParams & { category?: string }
  ): Promise<PaginatedResponse<Media>> {
    if (this.useMockData) {
      let filteredData = mediaSampleData.filter((m) => m.storeId === storeId);

      if (filters?.category) {
        filteredData = filteredData.filter((m) => m.category === filters.category);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Media>>(`/${storeId}/media`, filters);
  }

  /**
   * オプション一覧を取得
   */
  async getOptions(
    storeId: string,
    filters?: PaginationParams
  ): Promise<PaginatedResponse<StoreOptions>> {
    if (this.useMockData) {
      const filteredData = storeOptionsSampleData.filter((o) => o.storeId === storeId);
      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StoreOptions>>(`/${storeId}/options`, filters);
  }

  /**
   * 汎用的な更新メソッド
   */
  async updateStoreData<T extends { id: string }>(
    storeId: string,
    dataType: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    if (this.useMockData) {
      // モックデータの更新は各データソースで個別に実装する必要がある
      throw new Error('Mock data update not implemented for this data type');
    }

    return this.put<T>(`/${storeId}/${dataType}/${id}`, data);
  }

  /**
   * 汎用的な作成メソッド
   */
  async createStoreData<T extends { id?: string }>(
    storeId: string,
    dataType: string,
    data: Omit<T, 'id'>
  ): Promise<T> {
    if (this.useMockData) {
      throw new Error('Mock data creation not implemented for this data type');
    }

    return this.post<T>(`/${storeId}/${dataType}`, data);
  }

  /**
   * 汎用的な削除メソッド
   */
  async deleteStoreData(storeId: string, dataType: string, id: string): Promise<void> {
    if (this.useMockData) {
      throw new Error('Mock data deletion not implemented for this data type');
    }

    return this.delete(`/${storeId}/${dataType}/${id}`);
  }
}

// シングルトンインスタンスをエクスポート
export const storeService = new StoreService();
