/**
 * GraphQLクライアント
 * GraphQLリクエストを処理するためのシンプルなクライアント
 */
import axios, { AxiosRequestConfig } from 'axios';
import { 
  checkWritePermission, 
  createWriteBlockedError, 
  logApiOperation 
} from '../../config/api-security';
import { GraphQLRequest } from '../endpoints/GraphQLEndpointBuilder';

/**
 * GraphQLレスポンスの基本構造
 */
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

/**
 * GraphQLエラー
 */
export class GraphQLError extends Error {
  public errors: any[];
  public extensions: Record<string, any>;
  
  constructor(message: string, errors: any[] = [], extensions: Record<string, any> = {}) {
    super(message);
    this.name = 'GraphQLError';
    this.errors = errors;
    this.extensions = extensions;
  }
}

/**
 * GraphQLクライアントクラス
 */
export class GraphQLClient {
  private defaultEndpoint: string;
  private defaultHeaders: Record<string, string>;
  
  /**
   * コンストラクタ
   * @param endpoint デフォルトのGraphQLエンドポイント
   * @param headers デフォルトのヘッダー
   */
  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.defaultEndpoint = endpoint;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
  }
  
  /**
   * GraphQLリクエストを実行
   * @param request GraphQLリクエスト情報
   * @param config Axiosの追加設定
   * @returns レスポンスデータ
   */
  public async execute<T = any>(
    request: GraphQLRequest,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const endpoint = request.endpoint || this.defaultEndpoint;
    
    const headers = {
      ...this.defaultHeaders,
      ...request.headers
    };
    
    const payload = {
      query: request.query,
      variables: request.variables,
      operationName: request.operationName
    };
    
    try {
      const response = await axios.post<GraphQLResponse<T>>(
        endpoint,
        payload,
        {
          ...config,
          headers
        }
      );
      
      // エラーチェック
      if (response.data.errors && response.data.errors.length > 0) {
        const errorMessage = response.data.errors[0]?.message || 'GraphQL Error';
        throw new GraphQLError(
          errorMessage,
          response.data.errors,
          response.data.errors[0]?.extensions || {}
        );
      }
      
      return response.data.data as T;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // axiosエラーハンドリング
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as GraphQLResponse | undefined;
        if (data?.errors) {
          throw new GraphQLError(
            data.errors[0]?.message || error.message,
            data.errors,
            data.errors[0]?.extensions || {}
          );
        }
        throw new GraphQLError(
          error.message,
          [],
          { status: error.response?.status }
        );
      }
      
      // その他のエラー
      throw new GraphQLError((error as Error).message);
    }
  }
  
  /**
   * クエリを実行
   * @param query GraphQLクエリ
   * @param variables 変数
   * @param config Axiosの追加設定
   * @returns レスポンスデータ
   */
  public async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const request: GraphQLRequest = {
      endpoint: this.defaultEndpoint,
      operationType: 'query',
      operationName: '',
      query,
      variables: variables || {},
      headers: {}
    };
    
    return this.execute<T>(request, config);
  }
  
  /**
   * ミューテーションを実行
   * @param mutation GraphQLミューテーション
   * @param variables 変数
   * @param config Axiosの追加設定
   * @param operationName 操作名（セキュリティチェック用）
   * @returns レスポンスデータ
   */
  public async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    config?: AxiosRequestConfig,
    operationName: string = 'mutation'
  ): Promise<T> {
    // 書き込み権限のチェック
    const isAllowed = checkWritePermission('shopify', operationName);
    logApiOperation('shopify', 'MUTATION', operationName, isAllowed);
    
    // 権限が無い場合はエラーをスロー
    if (!isAllowed) {
      throw createWriteBlockedError('shopify', operationName);
    }
    
    const request: GraphQLRequest = {
      endpoint: this.defaultEndpoint,
      operationType: 'mutation',
      operationName: operationName || '',
      query: mutation,
      variables: variables || {},
      headers: {}
    };
    
    return this.execute<T>(request, config);
  }
}

// デフォルトのGraphQLクライアントインスタンスを作成
const graphqlClient = new GraphQLClient('/api/graphql');

export default graphqlClient;