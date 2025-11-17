// 従業員データ管理サービス
// APIとの連携を想定したインターフェースを提供

import { apiRequest, ApiError, BaseService } from './base-service';
import { EmployeeSalary, PartTimeSalary, EmployeeWeeklyShift } from '@/types/employee';

export interface EmployeeService extends BaseService {
  // 従業員給与一覧取得
  getEmployeeSalaries(year?: number, month?: number): Promise<EmployeeSalary[]>;
  
  // 従業員給与詳細取得
  getEmployeeSalaryById(id: string): Promise<EmployeeSalary | null>;
  
  // パートタイム給与一覧取得
  getPartTimeSalaries(year?: number, month?: number): Promise<PartTimeSalary[]>;
  
  // 従業員週間シフト取得
  getEmployeeWeeklyShifts(weekStartDate: string, weekEndDate: string): Promise<EmployeeWeeklyShift[]>;
  
  // 従業員週間シフト更新
  updateEmployeeWeeklyShift(id: string, shift: Partial<EmployeeWeeklyShift>): Promise<EmployeeWeeklyShift>;
  
  // 従業員週間シフト一括更新
  updateEmployeeWeeklyShifts(updates: Array<{ id: string; shift: Partial<EmployeeWeeklyShift> }>): Promise<EmployeeWeeklyShift[]>;
}

// APIサービス実装
class ApiEmployeeService implements EmployeeService {
  private readonly baseUrl = '/api/employees';

  async getEmployeeSalaries(year?: number, month?: number): Promise<EmployeeSalary[]> {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year.toString());
      if (month) params.append('month', month.toString());
      const query = params.toString();
      return await apiRequest<EmployeeSalary[]>(
        `${this.baseUrl}/salaries${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_037', '従業員給与一覧の取得に失敗しました');
    }
  }

  async getEmployeeSalaryById(id: string): Promise<EmployeeSalary | null> {
    try {
      return await apiRequest<EmployeeSalary>(`${this.baseUrl}/salaries/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getPartTimeSalaries(year?: number, month?: number): Promise<PartTimeSalary[]> {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year.toString());
      if (month) params.append('month', month.toString());
      const query = params.toString();
      return await apiRequest<PartTimeSalary[]>(
        `${this.baseUrl}/part-time-salaries${query ? `?${query}` : ''}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_038', 'パートタイム給与一覧の取得に失敗しました');
    }
  }

  async getEmployeeWeeklyShifts(weekStartDate: string, weekEndDate: string): Promise<EmployeeWeeklyShift[]> {
    try {
      return await apiRequest<EmployeeWeeklyShift[]>(
        `${this.baseUrl}/weekly-shifts?weekStartDate=${weekStartDate}&weekEndDate=${weekEndDate}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_039', '従業員週間シフトの取得に失敗しました');
    }
  }

  async updateEmployeeWeeklyShift(id: string, shift: Partial<EmployeeWeeklyShift>): Promise<EmployeeWeeklyShift> {
    try {
      return await apiRequest<EmployeeWeeklyShift>(`${this.baseUrl}/weekly-shifts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(shift),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_040', '従業員週間シフトの更新に失敗しました');
    }
  }

  async updateEmployeeWeeklyShifts(updates: Array<{ id: string; shift: Partial<EmployeeWeeklyShift> }>): Promise<EmployeeWeeklyShift[]> {
    try {
      return await apiRequest<EmployeeWeeklyShift[]>(`${this.baseUrl}/weekly-shifts/batch`, {
        method: 'PUT',
        body: JSON.stringify({ updates }),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('DB_041', '従業員週間シフトの一括更新に失敗しました');
    }
  }
}

// サービスインスタンスをエクスポート
export const employeeService: EmployeeService = new ApiEmployeeService();

