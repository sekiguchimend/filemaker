/**
 * Base Service Class
 * 全てのサービスクラスの基底クラス
 * 共通のAPI呼び出しロジックとエラーハンドリングを提供
 */

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseService {
  protected baseUrl: string;
  protected useMockData: boolean;

  constructor(endpoint: string = '') {
    // 環境変数からAPIのベースURLを取得（未設定の場合はlocalhost）
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // 開発環境またはAPIが未設定の場合はモックデータを使用
    this.useMockData =
      process.env.NODE_ENV === 'development' ||
      !process.env.NEXT_PUBLIC_API_URL;

    if (endpoint) {
      this.baseUrl = `${this.baseUrl}${endpoint}`;
    }
  }

  /**
   * GETリクエストを実行
   */
  protected async get<T>(path: string = '', params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseUrl}${path}`);

      // クエリパラメータを追加
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POSTリクエストを実行
   */
  protected async post<T>(path: string = '', data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUTリクエストを実行
   */
  protected async put<T>(path: string = '', data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETEリクエストを実行
   */
  protected async delete<T>(path: string = ''): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * リクエストヘッダーを取得
   */
  protected getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // 認証トークンがあれば追加
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const { state } = JSON.parse(authData);
          if (state?.user?.id) {
            // TODO: 実際のトークン管理に合わせて修正
            headers['Authorization'] = `Bearer ${state.user.id}`;
          }
        } catch (error) {
          console.error('Failed to parse auth data:', error);
        }
      }
    }

    return headers;
  }

  /**
   * レスポンスを処理
   */
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  }

  /**
   * エラーを処理
   */
  protected handleError(error: any): never {
    console.error('Service error:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred');
  }

  /**
   * ページネーション用のパラメータを正規化
   */
  protected normalizePaginationParams(params?: PaginationParams) {
    return {
      page: params?.page || 1,
      limit: params?.limit || 20,
    };
  }

  /**
   * モックデータからページネーションレスポンスを生成
   */
  protected createPaginatedResponse<T>(
    allData: T[],
    params?: PaginationParams
  ): PaginatedResponse<T> {
    const { page, limit } = this.normalizePaginationParams(params);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: allData.slice(startIndex, endIndex),
      total: allData.length,
      page,
      limit,
      totalPages: Math.ceil(allData.length / limit),
    };
  }
}
