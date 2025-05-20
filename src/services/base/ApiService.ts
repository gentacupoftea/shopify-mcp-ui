/**
 * API操作の基底サービスクラス
 * セキュリティ機能とエラーハンドリングを提供
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { 
  ApiPlatform, 
  checkWritePermission, 
  createWriteBlockedError,
  logApiOperation 
} from "../../config/api-security";

/**
 * API操作タイプ
 */
export type ApiOperationType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'QUERY' | 'MUTATION';

/**
 * API共通レスポンス型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * API基底サービスクラス
 */
export abstract class ApiService {
  protected client: AxiosInstance;
  protected platform: ApiPlatform;
  
  /**
   * コンストラクタ
   * @param baseURL API基本URL
   * @param platform APIプラットフォーム
   */
  constructor(baseURL: string, platform: ApiPlatform) {
    this.platform = platform;
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // レスポンスインターセプター
    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }
  
  /**
   * API書き込み操作の権限チェック
   * @param operationType 操作タイプ
   * @param operationName 操作名
   */
  protected validateWritePermission(operationType: ApiOperationType, operationName: string): void {
    // 読み取り操作はスキップ
    if (operationType === 'GET' || operationType === 'QUERY') {
      return;
    }
    
    // 書き込み操作の場合は権限チェック
    const isAllowed = checkWritePermission(this.platform, operationName);
    
    // 操作をログに記録
    logApiOperation(this.platform, operationType, operationName, isAllowed);
    
    // 許可されていない場合はエラーをスロー
    if (!isAllowed) {
      throw createWriteBlockedError(this.platform, operationName);
    }
  }
  
  /**
   * GETリクエスト
   * @param url エンドポイントURL
   * @param config リクエスト設定
   * @param operationName 操作名（ログ用）
   */
  protected async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig,
    operationName: string = 'get'
  ): Promise<T> {
    logApiOperation(this.platform, 'GET', operationName, true);
    
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return this.processResponse<T>(response);
  }
  
  /**
   * POSTリクエスト
   * @param url エンドポイントURL
   * @param data リクエストボディ
   * @param operationName 操作名
   * @param config リクエスト設定
   */
  protected async post<T = any>(
    url: string,
    data: any,
    operationName: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.validateWritePermission('POST', operationName);
    
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return this.processResponse<T>(response);
  }
  
  /**
   * PUTリクエスト
   * @param url エンドポイントURL
   * @param data リクエストボディ
   * @param operationName 操作名
   * @param config リクエスト設定
   */
  protected async put<T = any>(
    url: string,
    data: any,
    operationName: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.validateWritePermission('PUT', operationName);
    
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return this.processResponse<T>(response);
  }
  
  /**
   * PATCHリクエスト
   * @param url エンドポイントURL
   * @param data リクエストボディ
   * @param operationName 操作名
   * @param config リクエスト設定
   */
  protected async patch<T = any>(
    url: string,
    data: any,
    operationName: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.validateWritePermission('PATCH', operationName);
    
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return this.processResponse<T>(response);
  }
  
  /**
   * DELETEリクエスト
   * @param url エンドポイントURL
   * @param operationName 操作名
   * @param config リクエスト設定
   */
  protected async delete<T = any>(
    url: string,
    operationName: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    this.validateWritePermission('DELETE', operationName);
    
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return this.processResponse<T>(response);
  }
  
  /**
   * レスポンス成功ハンドラー
   */
  private handleSuccess(response: AxiosResponse<ApiResponse<any>>): AxiosResponse<ApiResponse<any>> {
    return response;
  }
  
  /**
   * レスポンスエラーハンドラー
   */
  private handleError(error: any): Promise<never> {
    let errorMessage = 'Unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails = undefined;
    
    if (error.response) {
      // APIからのレスポンスエラー
      const data = error.response.data;
      errorMessage = data?.error?.message || `Server error: ${error.response.status}`;
      errorCode = data?.error?.code || `HTTP_${error.response.status}`;
      errorDetails = data?.error?.details;
    } else if (error.request) {
      // リクエストが送信されたがレスポンスが返ってこなかった
      errorMessage = 'No response received from server';
      errorCode = 'NETWORK_ERROR';
    } else {
      // リクエスト設定中にエラーが発生
      errorMessage = error.message || errorMessage;
      
      // セキュリティ制限によるエラーの場合は特別処理
      if (error.isSecurityRestriction) {
        errorCode = 'WRITE_OPERATION_BLOCKED';
        errorDetails = {
          platform: error.platform,
          operation: error.operation
        };
      }
    }
    
    // 標準化されたエラーオブジェクトを返す
    return Promise.reject({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: errorDetails
      }
    });
  }
  
  /**
   * APIレスポンスの処理
   */
  private processResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const data = response.data;
    
    if (!data.success || !data.data) {
      throw {
        success: false,
        error: data.error || {
          code: 'API_ERROR',
          message: 'API returned unsuccessful response',
        }
      };
    }
    
    return data.data;
  }
}