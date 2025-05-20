/**
 * Shopify注文関連サービス
 * セキュリティ機能を統合した実装
 */
import { ApiService } from './base/ApiService';
import { Order, PaginationParams, FilterParams } from "@/types";

interface OrdersResponse {
  items: Order[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Shopify注文サービスクラス
 */
class ShopifyOrdersService extends ApiService {
  /**
   * コンストラクタ
   */
  constructor() {
    // APIサービスの初期化（基本URLとプラットフォーム指定）
    super('/api/v1', 'shopify');
  }
  
  /**
   * 注文一覧取得
   */
  async getOrders(
    pagination: PaginationParams,
    filters: FilterParams,
  ): Promise<OrdersResponse> {
    const params = {
      page: pagination.page,
      per_page: pagination.perPage,
      sort_by: pagination.sortBy,
      sort_order: pagination.sortOrder,
      ...filters,
    };

    return this.get<OrdersResponse>("/orders", {
      params,
    }, 'getOrders');
  }

  /**
   * 注文詳細取得
   */
  async getOrderById(id: string): Promise<Order> {
    return this.get<Order>(`/orders/${id}`, undefined, 'getOrderById');
  }

  /**
   * 注文ステータス更新
   */
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.patch<Order>(
      `/orders/${id}/status`,
      { status },
      'updateOrderStatus'
    );
  }

  /**
   * 注文キャンセル
   */
  async cancelOrder(id: string, reason: string): Promise<Order> {
    return this.post<Order>(
      `/orders/${id}/cancel`,
      { reason },
      'cancelOrder'
    );
  }

  /**
   * 注文同期
   */
  async syncOrders(platform: string): Promise<OrdersResponse> {
    return this.post<OrdersResponse>(
      `/orders/sync/${platform}`,
      {},
      'syncOrders'
    );
  }

  /**
   * 注文エクスポート
   */
  async exportOrders(
    format: "csv" | "excel" | "pdf",
    filters?: FilterParams,
  ): Promise<Blob> {
    const response = await this.client.get("/orders/export", {
      params: {
        format,
        ...filters,
      },
      responseType: "blob",
    });

    return response.data;
  }

  /**
   * 配送ラベル取得
   */
  async getShippingLabel(orderId: string): Promise<Blob> {
    const response = await this.client.get(`/orders/${orderId}/shipping-label`, {
      responseType: "blob",
    });

    return response.data;
  }

  /**
   * トラッキング情報更新
   */
  async updateTracking(
    orderId: string,
    trackingNumber: string,
    carrier: string,
  ): Promise<Order> {
    return this.patch<Order>(
      `/orders/${orderId}/tracking`,
      {
        trackingNumber,
        carrier,
      },
      'updateTracking'
    );
  }

  /**
   * 返金処理
   */
  async refundOrder(
    orderId: string,
    amount: number,
    reason: string,
  ): Promise<{ refundId: string; status: string }> {
    return this.post<{ refundId: string; status: string }>(
      `/orders/${orderId}/refund`,
      {
        amount,
        reason,
      },
      'refundOrder'
    );
  }

  /**
   * 注文メモ追加
   */
  async addOrderNote(
    orderId: string,
    note: string,
    isPrivate: boolean = true,
  ): Promise<Order> {
    return this.post<Order>(
      `/orders/${orderId}/notes`,
      {
        note,
        isPrivate,
      },
      'addOrderNote'
    );
  }

  /**
   * 請求書生成
   */
  async generateInvoice(orderId: string): Promise<Blob> {
    const response = await this.client.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    return response.data;
  }

  /**
   * 一括ステータス更新
   */
  async bulkUpdateStatus(
    orderIds: string[],
    status: string,
  ): Promise<{ updated: number }> {
    return this.post<{ updated: number }>(
      "/orders/bulk/status",
      {
        orderIds,
        status,
      },
      'bulkUpdateStatus'
    );
  }

  /**
   * 売上統計取得
   */
  async getSalesStats(
    dateRange: { start: Date; end: Date },
    groupBy: "day" | "week" | "month",
  ): Promise<any> {
    return this.get<any>("/orders/stats/sales", {
      params: {
        start_date: dateRange.start.toISOString(),
        end_date: dateRange.end.toISOString(),
        group_by: groupBy,
      }
    }, 'getSalesStats');
  }
}

export default new ShopifyOrdersService();