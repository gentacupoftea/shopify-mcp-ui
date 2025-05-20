/**
 * 基本APIクライアントのインターフェース
 * すべてのECプラットフォームAPI実装の基礎となる抽象クラス
 */
import { AxiosResponse } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  queryParams?: Record<string, string | string[] | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface APIResponse<T> {
  data: T;
  headers?: Record<string, string>;
  status: number;
}

/**
 * すべてのプラットフォームAPIクライアントが実装する基本インターフェース
 */
export abstract class BaseAPIClient {
  /**
   * API認証を行う
   */
  abstract authenticate(): Promise<void>;

  /**
   * 認証トークンをリフレッシュする
   */
  abstract refreshAuth(): Promise<void>;

  /**
   * APIリクエストを実行する
   * @param endpoint APIエンドポイントパス
   * @param method HTTPメソッド
   * @param options リクエストオプション
   */
  abstract makeRequest<T>(
    endpoint: string, 
    method: HttpMethod, 
    options?: RequestOptions
  ): Promise<T>;

  /**
   * レート制限を処理する
   * @param response APIレスポンス
   */
  abstract handleRateLimits(response: AxiosResponse): void;

  /**
   * APIエラーを処理する
   * @param error エラーオブジェクト
   */
  abstract handleErrors(error: any): never;
}

/**
 * エラーコードの基本分類
 */
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 標準化されたAPIエラー
 */
export class APIError extends Error {
  statusCode: number;
  category: ErrorCategory;
  retryable: boolean;
  platformErrorCode?: string;
  requestId?: string;
  timestamp: Date;

  constructor(
    message: string,
    statusCode: number = 500,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    retryable: boolean = false,
    platformErrorCode?: string,
    requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.category = category;
    this.retryable = retryable;
    this.platformErrorCode = platformErrorCode;
    this.requestId = requestId;
    this.timestamp = new Date();
  }

  /**
   * エラーの詳細情報を取得
   */
  getDetails(): Record<string, any> {
    return {
      message: this.message,
      statusCode: this.statusCode,
      category: this.category,
      retryable: this.retryable,
      platformErrorCode: this.platformErrorCode,
      requestId: this.requestId,
      timestamp: this.timestamp.toISOString()
    };
  }
}