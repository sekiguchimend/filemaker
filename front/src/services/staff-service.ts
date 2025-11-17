/**
 * Staff Service
 * スタッフ・従業員関連のデータ操作を管理
 */

import { BaseService, PaginationParams, PaginatedResponse } from './base-service';
import {
  EmployeeSalary,
  PartTimeSalary,
  EmployeeSchedule,
  StaffLedger,
  EmployeeWeeklyShift,
} from '@/types/employee';
import { StaffAttendanceData } from '@/types/staff-attendance';
import {
  sampleEmployeeSalaries,
  samplePartTimeSalaries,
  sampleEmployeeSchedules,
  sampleStaffLedger,
  sampleEmployeeWeeklyShifts,
} from '@/data/employeeSampleData';
import { staffAttendanceSampleData } from '@/data/staffAttendanceSampleData';

export interface StaffFilters {
  status?: 'active' | 'inactive' | 'on_leave' | 'terminated';
  position?: string;
  department?: string;
  search?: string;
}

export interface SalaryFilters {
  year?: number;
  month?: number;
  position?: string;
  department?: string;
}

export interface ScheduleFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export class StaffService extends BaseService {
  constructor() {
    super('/api/staff');
  }

  /**
   * スタッフ台帳一覧を取得
   */
  async getStaffLedger(
    filters?: StaffFilters & PaginationParams
  ): Promise<PaginatedResponse<StaffLedger>> {
    if (this.useMockData) {
      let filteredData = [...sampleStaffLedger];

      if (filters?.status) {
        filteredData = filteredData.filter((s) => s.status === filters.status);
      }

      if (filters?.position) {
        filteredData = filteredData.filter(
          (s) => s.employmentInfo.position === filters.position
        );
      }

      if (filters?.department) {
        filteredData = filteredData.filter(
          (s) => s.employmentInfo.department === filters.department
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (s) =>
            s.personalInfo.name.toLowerCase().includes(searchLower) ||
            s.personalInfo.nameKana.toLowerCase().includes(searchLower) ||
            s.employeeNumber.toLowerCase().includes(searchLower)
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StaffLedger>>('/ledger', filters);
  }

  /**
   * 特定のスタッフ情報を取得
   */
  async getStaffById(id: string): Promise<StaffLedger> {
    if (this.useMockData) {
      const staff = sampleStaffLedger.find((s) => s.id === id);
      if (!staff) {
        throw new Error(`Staff with id ${id} not found`);
      }
      return staff;
    }

    return this.get<StaffLedger>(`/ledger/${id}`);
  }

  /**
   * スタッフ情報を作成
   */
  async createStaff(data: Omit<StaffLedger, 'id'>): Promise<StaffLedger> {
    if (this.useMockData) {
      const newStaff: StaffLedger = {
        ...data,
        id: `staff${Date.now()}`,
      };
      sampleStaffLedger.push(newStaff);
      return newStaff;
    }

    return this.post<StaffLedger>('/ledger', data);
  }

  /**
   * スタッフ情報を更新
   */
  async updateStaff(id: string, data: Partial<StaffLedger>): Promise<StaffLedger> {
    if (this.useMockData) {
      const index = sampleStaffLedger.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Staff with id ${id} not found`);
      }
      sampleStaffLedger[index] = { ...sampleStaffLedger[index], ...data };
      return sampleStaffLedger[index];
    }

    return this.put<StaffLedger>(`/ledger/${id}`, data);
  }

  /**
   * 従業員給与一覧を取得
   */
  async getEmployeeSalaries(
    filters?: SalaryFilters & PaginationParams
  ): Promise<PaginatedResponse<EmployeeSalary>> {
    if (this.useMockData) {
      let filteredData = [...sampleEmployeeSalaries];

      if (filters?.year !== undefined && filters?.month !== undefined) {
        filteredData = filteredData.filter(
          (s) =>
            s.salaryPeriod.year === filters.year &&
            s.salaryPeriod.month === filters.month
        );
      }

      if (filters?.position) {
        filteredData = filteredData.filter((s) => s.position === filters.position);
      }

      if (filters?.department) {
        filteredData = filteredData.filter((s) => s.department === filters.department);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<EmployeeSalary>>('/salaries/employee', filters);
  }

  /**
   * パートタイム給与一覧を取得
   */
  async getPartTimeSalaries(
    filters?: SalaryFilters & PaginationParams
  ): Promise<PaginatedResponse<PartTimeSalary>> {
    if (this.useMockData) {
      let filteredData = [...samplePartTimeSalaries];

      if (filters?.year !== undefined && filters?.month !== undefined) {
        filteredData = filteredData.filter(
          (s) =>
            s.salaryPeriod.year === filters.year &&
            s.salaryPeriod.month === filters.month
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<PartTimeSalary>>('/salaries/part-time', filters);
  }

  /**
   * 従業員スケジュール一覧を取得
   */
  async getEmployeeSchedules(
    filters?: ScheduleFilters & PaginationParams
  ): Promise<PaginatedResponse<EmployeeSchedule>> {
    if (this.useMockData) {
      let filteredData = [...sampleEmployeeSchedules];

      if (filters?.employeeId) {
        filteredData = filteredData.filter(
          (s) => s.employeeId === filters.employeeId
        );
      }

      if (filters?.status) {
        filteredData = filteredData.filter((s) => s.status === filters.status);
      }

      if (filters?.startDate) {
        filteredData = filteredData.filter(
          (s) => s.scheduleDate >= filters.startDate!
        );
      }

      if (filters?.endDate) {
        filteredData = filteredData.filter((s) => s.scheduleDate <= filters.endDate!);
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<EmployeeSchedule>>('/schedules', filters);
  }

  /**
   * 従業員スケジュールを作成
   */
  async createEmployeeSchedule(
    data: Omit<EmployeeSchedule, 'id'>
  ): Promise<EmployeeSchedule> {
    if (this.useMockData) {
      const newSchedule: EmployeeSchedule = {
        ...data,
        id: `schedule${Date.now()}`,
      };
      sampleEmployeeSchedules.push(newSchedule);
      return newSchedule;
    }

    return this.post<EmployeeSchedule>('/schedules', data);
  }

  /**
   * 従業員スケジュールを更新
   */
  async updateEmployeeSchedule(
    id: string,
    data: Partial<EmployeeSchedule>
  ): Promise<EmployeeSchedule> {
    if (this.useMockData) {
      const index = sampleEmployeeSchedules.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Schedule with id ${id} not found`);
      }
      sampleEmployeeSchedules[index] = { ...sampleEmployeeSchedules[index], ...data };
      return sampleEmployeeSchedules[index];
    }

    return this.put<EmployeeSchedule>(`/schedules/${id}`, data);
  }

  /**
   * 週間シフト一覧を取得
   */
  async getWeeklyShifts(
    filters?: { weekStartDate?: string } & PaginationParams
  ): Promise<PaginatedResponse<EmployeeWeeklyShift>> {
    if (this.useMockData) {
      let filteredData = [...sampleEmployeeWeeklyShifts];

      if (filters?.weekStartDate) {
        filteredData = filteredData.filter(
          (s) => s.weekStartDate === filters.weekStartDate
        );
      }

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<EmployeeWeeklyShift>>('/shifts/weekly', filters);
  }

  /**
   * 週間シフトを更新
   */
  async updateWeeklyShift(
    id: string,
    data: Partial<EmployeeWeeklyShift>
  ): Promise<EmployeeWeeklyShift> {
    if (this.useMockData) {
      const index = sampleEmployeeWeeklyShifts.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Weekly shift with id ${id} not found`);
      }
      sampleEmployeeWeeklyShifts[index] = {
        ...sampleEmployeeWeeklyShifts[index],
        ...data,
      };
      return sampleEmployeeWeeklyShifts[index];
    }

    return this.put<EmployeeWeeklyShift>(`/shifts/weekly/${id}`, data);
  }

  /**
   * スタッフ出勤管理データを取得
   */
  async getStaffAttendance(
    filters?: { date?: string } & PaginationParams
  ): Promise<PaginatedResponse<StaffAttendanceData>> {
    if (this.useMockData) {
      let filteredData = [...staffAttendanceSampleData];

      // 日付フィルタは今のところサンプルデータでは実装せず

      return this.createPaginatedResponse(filteredData, filters);
    }

    return this.get<PaginatedResponse<StaffAttendanceData>>('/attendance', filters);
  }

  /**
   * スタッフ出勤情報を更新
   */
  async updateStaffAttendance(
    id: string,
    data: Partial<StaffAttendanceData>
  ): Promise<StaffAttendanceData> {
    if (this.useMockData) {
      const index = staffAttendanceSampleData.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Attendance record with id ${id} not found`);
      }
      staffAttendanceSampleData[index] = {
        ...staffAttendanceSampleData[index],
        ...data,
      };
      return staffAttendanceSampleData[index];
    }

    return this.put<StaffAttendanceData>(`/attendance/${id}`, data);
  }

  /**
   * スタッフの統計情報を取得
   */
  async getStaffStats(staffId: string, period?: { from: string; to: string }) {
    if (this.useMockData) {
      const staff = sampleStaffLedger.find((s) => s.id === staffId);
      if (!staff) {
        throw new Error(`Staff with id ${staffId} not found`);
      }

      return {
        totalWorkDays: staff.workHistory.totalWorkDays,
        totalWorkHours: staff.workHistory.totalWorkHours,
        averageRating: staff.workHistory.averageRating,
        period: period || { from: '2025-01-01', to: '2025-01-31' },
      };
    }

    return this.get(`/ledger/${staffId}/stats`, period);
  }
}

// シングルトンインスタンスをエクスポート
export const staffService = new StaffService();
