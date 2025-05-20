/**
 * エンドポイントビルダー関連のエクスポート
 */
import { EndpointBuilder, PathParams, QueryParams } from "./EndpointBuilder";
import { ENDPOINTS, API_VERSION } from "./constants";
import { ECPlatform } from "@/types";

/**
 * 商品エンドポイントビルダーを作成
 */
export function createProductsEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.PRODUCTS.BASE, API_VERSION);
}

/**
 * 特定IDの商品エンドポイントビルダーを作成
 */
export function createProductDetailEndpoint(productId: string): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.PRODUCTS.DETAIL, API_VERSION)
    .withPathParams({ id: productId });
}

/**
 * 注文エンドポイントビルダーを作成
 */
export function createOrdersEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.ORDERS.BASE, API_VERSION);
}

/**
 * 特定IDの注文エンドポイントビルダーを作成
 */
export function createOrderDetailEndpoint(orderId: string): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.ORDERS.DETAIL, API_VERSION)
    .withPathParams({ id: orderId });
}

/**
 * 顧客エンドポイントビルダーを作成
 */
export function createCustomersEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.CUSTOMERS.BASE, API_VERSION);
}

/**
 * 特定IDの顧客エンドポイントビルダーを作成
 */
export function createCustomerDetailEndpoint(customerId: string): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.CUSTOMERS.DETAIL, API_VERSION)
    .withPathParams({ id: customerId });
}

/**
 * プラットフォーム同期エンドポイントビルダーを作成
 */
export function createSyncEndpoint(resource: "products" | "orders" | "customers", platform: ECPlatform): EndpointBuilder {
  const basePath = 
    resource === "products" ? ENDPOINTS.PRODUCTS.SYNC :
    resource === "orders" ? ENDPOINTS.ORDERS.SYNC :
    ENDPOINTS.CUSTOMERS.SYNC;
    
  return new EndpointBuilder(basePath, API_VERSION)
    .withPathParams({ platform });
}

/**
 * ダッシュボードエンドポイントビルダーを作成
 */
export function createDashboardEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.DASHBOARD.BASE, API_VERSION);
}

/**
 * ウィジェットエンドポイントビルダーを作成
 */
export function createWidgetEndpoint(widgetId?: string): EndpointBuilder {
  const basePath = widgetId 
    ? ENDPOINTS.DASHBOARD.WIDGET_DETAIL
    : ENDPOINTS.DASHBOARD.WIDGETS;
    
  const builder = new EndpointBuilder(basePath, API_VERSION);
  
  if (widgetId) {
    builder.withPathParams({ id: widgetId });
  }
  
  return builder;
}

/**
 * レポートエンドポイントビルダーを作成
 */
export function createReportsEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.REPORTS.BASE, API_VERSION);
}

/**
 * 設定エンドポイントビルダーを作成
 */
export function createSettingsEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.SETTINGS.BASE, API_VERSION);
}

/**
 * プラットフォーム設定エンドポイントビルダーを作成
 */
export function createPlatformSettingsEndpoint(platform: ECPlatform): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.SETTINGS.PLATFORM, API_VERSION)
    .withPathParams({ platform });
}

/**
 * 通知エンドポイントビルダーを作成
 */
export function createNotificationsEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.NOTIFICATIONS.BASE, API_VERSION);
}

/**
 * チャット分析エンドポイントビルダーを作成
 */
export function createChatAnalysisEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.CHAT_ANALYSIS.BASE, API_VERSION);
}

// エンドポイントビルダーと定数をエクスポート
export { EndpointBuilder, ENDPOINTS, API_VERSION };
export type { PathParams, QueryParams };