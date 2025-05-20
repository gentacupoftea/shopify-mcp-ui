/**
 * Shopify専用サービス
 * Shopify APIへの接続と操作を行うサービス
 */
import api from "../api";
import { BaseAPIClient, RequestOptions, HttpMethod, APIResponse } from "../interfaces/BaseAPIClient";
import { APIError, ErrorCategory } from "../interfaces/BaseAPIClient";
import { 
  createProductsEndpoint, 
  createOrdersEndpoint,
  createSyncEndpoint 
} from "../endpoints";
import { AxiosError, AxiosResponse } from "axios";

export interface ShopifyConfig {
  shopUrl: string;
  accessToken: string;
  apiVersion: string;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  status: string;
  variants: any[];
  images: any[];
  options: any[];
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface ShopifyOrder {
  id: number;
  order_number: number;
  name: string;
  customer: any;
  line_items: any[];
  shipping_address: any;
  billing_address: any;
  financial_status: string;
  fulfillment_status: string;
  total_price: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

/**
 * Shopify API専用サービスクラス
 */
export class ShopifyService implements BaseAPIClient {
  private config: ShopifyConfig;
  private isAuthenticated: boolean = false;

  constructor(config: ShopifyConfig) {
    this.config = config;
  }

  /**
   * API認証処理
   */
  async authenticate(): Promise<void> {
    try {
      // APIキーの検証（Shopifyの場合はaccessTokenの検証）
      const testEndpoint = createProductsEndpoint()
        .withQueryParams({ limit: 1 })
        .build();
      
      await this.makeRequest<any>(testEndpoint, "GET");
      this.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      throw new APIError(
        "Shopify API認証に失敗しました",
        401,
        ErrorCategory.AUTHENTICATION,
        false
      );
    }
  }

  /**
   * 認証トークンリフレッシュ処理
   * Shopifyの場合はアクセストークンを永続的に使用するので、
   * 実際のリフレッシュ処理は不要
   */
  async refreshAuth(): Promise<void> {
    // Shopifyの場合、リフレッシュトークンの仕組みがないため実装しない
    return Promise.resolve();
  }

  /**
   * APIリクエスト実行
   */
  async makeRequest<T>(
    endpoint: string,
    method: HttpMethod,
    options?: RequestOptions
  ): Promise<T> {
    try {
      const headers = {
        "X-Shopify-Access-Token": this.config.accessToken,
        "Content-Type": "application/json",
        ...options?.headers
      };

      // Shopify APIのベースURL
      const shopifyApiUrl = `https://${this.config.shopUrl}/admin/api/${this.config.apiVersion}`;
      
      // エンドポイントが完全なURLかどうかを確認
      const url = endpoint.startsWith("http") ? endpoint : `${shopifyApiUrl}${endpoint}`;

      const response = await api[method.toLowerCase()]<APIResponse<T>>(
        url,
        method === "GET" || method === "DELETE" ? { 
          headers, 
          params: options?.queryParams 
        } : options?.body,
        { headers }
      );

      this.handleRateLimits(response as unknown as AxiosResponse);
      return response as unknown as T;
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * レート制限処理
   */
  handleRateLimits(response: AxiosResponse): void {
    // Shopify API制限のヘッダーを解析
    const callsLeft = response.headers["x-shopify-shop-api-call-limit"];
    
    if (callsLeft) {
      const [used, limit] = callsLeft.split("/").map(Number);
      const remainingPercentage = ((limit - used) / limit) * 100;
      
      // API使用量が90%を超えた場合は警告
      if (remainingPercentage < 10) {
        console.warn(`Shopify API使用量が上限に近づいています: ${used}/${limit} (${remainingPercentage.toFixed(2)}% 残り)`);
      }
    }
  }

  /**
   * エラー処理
   */
  handleErrors(error: any): never {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const data = axiosError.response.data as any;
      
      let category: ErrorCategory;
      let retryable = false;
      
      switch (statusCode) {
        case 401:
          category = ErrorCategory.AUTHENTICATION;
          break;
        case 403:
          category = ErrorCategory.AUTHORIZATION;
          break;
        case 404:
          category = ErrorCategory.RESOURCE_NOT_FOUND;
          break;
        case 422:
          category = ErrorCategory.VALIDATION;
          break;
        case 429:
          category = ErrorCategory.RATE_LIMIT;
          retryable = true;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          category = ErrorCategory.SERVER_ERROR;
          retryable = true;
          break;
        default:
          category = ErrorCategory.UNKNOWN;
      }
      
      const message = data.errors || data.error || "Shopify APIエラー";
      throw new APIError(
        typeof message === "string" ? message : JSON.stringify(message),
        statusCode,
        category,
        retryable
      );
    }
    
    if (axiosError.request) {
      throw new APIError(
        "ネットワークエラー: Shopify APIに接続できません",
        0,
        ErrorCategory.NETWORK_ERROR,
        true
      );
    }
    
    throw new APIError(
      error.message || "不明なエラー",
      0,
      ErrorCategory.UNKNOWN,
      false
    );
  }

  /**
   * 商品一覧を取得
   */
  async getProducts(options?: {
    limit?: number;
    page?: number;
    collectionId?: number;
    productIds?: number[];
    status?: "active" | "archived" | "draft";
  }): Promise<ShopifyProduct[]> {
    const endpoint = createProductsEndpoint()
      .withQueryParams({
        limit: options?.limit || 50,
        page: options?.page,
        collection_id: options?.collectionId,
        ids: options?.productIds?.join(","),
        status: options?.status
      })
      .build();

    const response = await this.makeRequest<{ products: ShopifyProduct[] }>(
      endpoint,
      "GET"
    );
    
    return response.products;
  }

  /**
   * 特定の商品を取得
   */
  async getProductById(productId: number): Promise<ShopifyProduct> {
    const endpoint = createProductsEndpoint()
      .withSubResource(String(productId))
      .build();
      
    const response = await this.makeRequest<{ product: ShopifyProduct }>(
      endpoint,
      "GET"
    );
    
    return response.product;
  }

  /**
   * 注文一覧を取得
   */
  async getOrders(options?: {
    limit?: number;
    page?: number;
    status?: "open" | "closed" | "cancelled" | "any";
    financialStatus?: string;
    fulfillmentStatus?: string;
  }): Promise<ShopifyOrder[]> {
    const endpoint = createOrdersEndpoint()
      .withQueryParams({
        limit: options?.limit || 50,
        page: options?.page,
        status: options?.status,
        financial_status: options?.financialStatus,
        fulfillment_status: options?.fulfillmentStatus
      })
      .build();

    const response = await this.makeRequest<{ orders: ShopifyOrder[] }>(
      endpoint,
      "GET"
    );
    
    return response.orders;
  }

  /**
   * 商品同期を実行
   */
  async syncProducts(): Promise<{ count: number }> {
    const endpoint = createSyncEndpoint("products", "shopify").build();
    
    return this.makeRequest<{ count: number }>(
      endpoint,
      "POST"
    );
  }

  /**
   * 注文同期を実行
   */
  async syncOrders(): Promise<{ count: number }> {
    const endpoint = createSyncEndpoint("orders", "shopify").build();
    
    return this.makeRequest<{ count: number }>(
      endpoint,
      "POST"
    );
  }
}

export default ShopifyService;