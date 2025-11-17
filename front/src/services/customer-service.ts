/**
 * Customer Service
 * 顧客関連のデータ操作を管理
 */

import { BaseService, PaginationParams, PaginatedResponse } from './base-service';
import {
  Customer,
  CustomerPoints,
  CustomerVehicleInfo,
  GroupLedger,
  PointTransaction,
} from '@/types/customer';
import {
  sampleCustomers,
  sampleCustomerPoints,
  sampleCustomerVehicles,
  sampleGroupLedgers,
} from '@/data/customerSampleData';

export interface CustomerFilters {
  storeNumber?: string;
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
  tags?: string[];
}

export interface CustomerVehicleFilters {
  customerId?: string;
  isActive?: boolean;
  search?: string;
}

export class CustomerService extends BaseService {
  constructor() {
    super('/api/customers');
  }

  /**
   * 顧客台帳の一覧を取得
   */
  async getCustomers(
    filters?: CustomerFilters & PaginationParams
  ): Promise<PaginatedResponse<Customer>> {
    if (this.useMockData) {
      let filteredData = [...sampleCustomers];

      if (filters?.status) {
        filteredData = filteredData.filter((c) => c.status === filters.status);
      }

      if (filters?.storeNumber) {
        filteredData = filteredData.filter((c) => c.storeNumber === filters.storeNumber);
      }

      if (filters?.tags && filters.tags.length > 0) {
        filteredData = filteredData.filter((c) =>
          filters.tags!.some((tag) => c.tags.includes(tag))
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.nameKana.toLowerCase().includes(searchLower) ||
            c.customerNumber.toLowerCase().includes(searchLower) ||
            c.company?.toLowerCase().includes(searchLower)
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<Customer>>('', filters);
  }

  /**
   * 特定の顧客情報を取得
   */
  async getCustomerById(id: string): Promise<Customer> {
    if (this.useMockData) {
      const customer = sampleCustomers.find((c) => c.id === id);
      if (!customer) {
        throw new Error(`Customer with id ${id} not found`);
      }
      return customer;
    }

    return this.get<Customer>(`/${id}`);
  }

  /**
   * 顧客情報を作成
   */
  async createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
    if (this.useMockData) {
      const newCustomer: Customer = {
        ...data,
        id: `cust${Date.now()}`,
      };
      sampleCustomers.push(newCustomer);
      return newCustomer;
    }

    return this.post<Customer>('', data);
  }

  /**
   * 顧客情報を更新
   */
  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    if (this.useMockData) {
      const index = sampleCustomers.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error(`Customer with id ${id} not found`);
      }
      sampleCustomers[index] = { ...sampleCustomers[index], ...data };
      return sampleCustomers[index];
    }

    return this.put<Customer>(`/${id}`, data);
  }

  /**
   * 顧客情報を削除
   */
  async deleteCustomer(id: string): Promise<void> {
    if (this.useMockData) {
      const index = sampleCustomers.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error(`Customer with id ${id} not found`);
      }
      sampleCustomers.splice(index, 1);
      return;
    }

    return this.delete(`/${id}`);
  }

  /**
   * 顧客ポイント情報を取得
   */
  async getCustomerPoints(customerId: string): Promise<CustomerPoints> {
    if (this.useMockData) {
      const points = sampleCustomerPoints.find((p) => p.customerId === customerId);
      if (!points) {
        // ポイントデータがない場合は空のデータを返す
        return {
          id: `points${customerId}`,
          customerId,
          customerName: '',
          currentPoints: 0,
          totalEarnedPoints: 0,
          totalUsedPoints: 0,
          pointHistory: [],
          expiringPoints: [],
        };
      }
      return points;
    }

    return this.get<CustomerPoints>(`/${customerId}/points`);
  }

  /**
   * ポイントを追加
   */
  async addPoints(
    customerId: string,
    points: number,
    reason: string
  ): Promise<CustomerPoints> {
    if (this.useMockData) {
      const customerPoints = await this.getCustomerPoints(customerId);
      const newTransaction: PointTransaction = {
        id: `pt${Date.now()}`,
        date: new Date().toISOString(),
        type: 'earned',
        points,
        reason,
        balance: customerPoints.currentPoints + points,
      };

      customerPoints.currentPoints += points;
      customerPoints.totalEarnedPoints += points;
      customerPoints.pointHistory.unshift(newTransaction);
      customerPoints.lastEarnedDate = newTransaction.date;

      return customerPoints;
    }

    return this.post<CustomerPoints>(`/${customerId}/points/add`, { points, reason });
  }

  /**
   * ポイントを使用
   */
  async usePoints(
    customerId: string,
    points: number,
    reason: string
  ): Promise<CustomerPoints> {
    if (this.useMockData) {
      const customerPoints = await this.getCustomerPoints(customerId);

      if (customerPoints.currentPoints < points) {
        throw new Error('Insufficient points');
      }

      const newTransaction: PointTransaction = {
        id: `pt${Date.now()}`,
        date: new Date().toISOString(),
        type: 'used',
        points: -points,
        reason,
        balance: customerPoints.currentPoints - points,
      };

      customerPoints.currentPoints -= points;
      customerPoints.totalUsedPoints += points;
      customerPoints.pointHistory.unshift(newTransaction);
      customerPoints.lastUsedDate = newTransaction.date;

      return customerPoints;
    }

    return this.post<CustomerPoints>(`/${customerId}/points/use`, { points, reason });
  }

  /**
   * 顧客車両情報一覧を取得
   */
  async getCustomerVehicles(
    filters?: CustomerVehicleFilters & PaginationParams
  ): Promise<PaginatedResponse<CustomerVehicleInfo>> {
    if (this.useMockData) {
      let filteredData = [...sampleCustomerVehicles];

      if (filters?.customerId) {
        filteredData = filteredData.filter((v) => v.customerId === filters.customerId);
      }

      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter((v) => v.isActive === filters.isActive);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (v) =>
            v.vehicleNumber.toLowerCase().includes(searchLower) ||
            v.vehicleType.toLowerCase().includes(searchLower) ||
            v.customerName.toLowerCase().includes(searchLower)
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<CustomerVehicleInfo>>('/vehicles', filters);
  }

  /**
   * 顧客車両情報を作成
   */
  async createCustomerVehicle(
    data: Omit<CustomerVehicleInfo, 'id'>
  ): Promise<CustomerVehicleInfo> {
    if (this.useMockData) {
      const newVehicle: CustomerVehicleInfo = {
        ...data,
        id: `vehicle${Date.now()}`,
      };
      sampleCustomerVehicles.push(newVehicle);
      return newVehicle;
    }

    return this.post<CustomerVehicleInfo>('/vehicles', data);
  }

  /**
   * 顧客車両情報を更新
   */
  async updateCustomerVehicle(
    id: string,
    data: Partial<CustomerVehicleInfo>
  ): Promise<CustomerVehicleInfo> {
    if (this.useMockData) {
      const index = sampleCustomerVehicles.findIndex((v) => v.id === id);
      if (index === -1) {
        throw new Error(`Vehicle with id ${id} not found`);
      }
      sampleCustomerVehicles[index] = { ...sampleCustomerVehicles[index], ...data };
      return sampleCustomerVehicles[index];
    }

    return this.put<CustomerVehicleInfo>(`/vehicles/${id}`, data);
  }

  /**
   * 顧客車両情報を削除
   */
  async deleteCustomerVehicle(id: string): Promise<void> {
    if (this.useMockData) {
      const index = sampleCustomerVehicles.findIndex((v) => v.id === id);
      if (index === -1) {
        throw new Error(`Vehicle with id ${id} not found`);
      }
      sampleCustomerVehicles.splice(index, 1);
      return;
    }

    return this.delete(`/vehicles/${id}`);
  }

  /**
   * グループ台帳一覧を取得
   */
  async getGroupLedger(
    filters?: PaginationParams & { status?: 'active' | 'inactive' }
  ): Promise<PaginatedResponse<GroupLedger>> {
    if (this.useMockData) {
      let filteredData = [...sampleGroupLedgers];

      if (filters?.status) {
        filteredData = filteredData.filter((g) => g.status === filters.status);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<GroupLedger>>('/groups', filters);
  }

  /**
   * グループ台帳を作成
   */
  async createGroupLedger(data: Omit<GroupLedger, 'id'>): Promise<GroupLedger> {
    if (this.useMockData) {
      const newGroup: GroupLedger = {
        ...data,
        id: `group${Date.now()}`,
      };
      sampleGroupLedgers.push(newGroup);
      return newGroup;
    }

    return this.post<GroupLedger>('/groups', data);
  }

  /**
   * グループ台帳を更新
   */
  async updateGroupLedger(id: string, data: Partial<GroupLedger>): Promise<GroupLedger> {
    if (this.useMockData) {
      const index = sampleGroupLedgers.findIndex((g) => g.id === id);
      if (index === -1) {
        throw new Error(`Group with id ${id} not found`);
      }
      sampleGroupLedgers[index] = { ...sampleGroupLedgers[index], ...data };
      return sampleGroupLedgers[index];
    }

    return this.put<GroupLedger>(`/groups/${id}`, data);
  }
}

// シングルトンインスタンスをエクスポート
export const customerService = new CustomerService();
