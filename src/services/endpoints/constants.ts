/**
 * エンドポイント定数
 * アプリケーション全体で使用するAPIエンドポイントの定義
 */

export const API_VERSION = "v1";

// GraphQLエンドポイント
export const GRAPHQL_ENDPOINT = "/api/graphql";

export const ENDPOINTS = {
  // GraphQL関連
  GRAPHQL: {
    ENDPOINT: GRAPHQL_ENDPOINT,
  },
  
  // 認証関連
  AUTH: {
    BASE: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register", 
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    RESET_PASSWORD: "/auth/password-reset",
    PROFILE: "/auth/profile",
  },
  
  // 商品関連
  PRODUCTS: {
    BASE: "/products",
    DETAIL: "/products/:id",
    BULK: "/products/bulk",
    SYNC: "/products/sync/:platform",
    EXPORT: "/products/export",
    IMPORT: "/products/import",
    INVENTORY: "/products/:id/inventory",
    IMAGES: "/products/:id/images",
    VARIANTS: "/products/:id/variants",
  },
  
  // 注文関連
  ORDERS: {
    BASE: "/orders",
    DETAIL: "/orders/:id",
    BULK: "/orders/bulk",
    SYNC: "/orders/sync/:platform",
    EXPORT: "/orders/export",
    STATUS: "/orders/:id/status",
    CANCEL: "/orders/:id/cancel",
    NOTES: "/orders/:id/notes",
    TRACKING: "/orders/:id/tracking",
    REFUND: "/orders/:id/refund",
    INVOICE: "/orders/:id/invoice",
    SHIPPING_LABEL: "/orders/:id/shipping-label",
    STATS: "/orders/stats",
    SALES_STATS: "/orders/stats/sales",
  },
  
  // 顧客関連
  CUSTOMERS: {
    BASE: "/customers",
    DETAIL: "/customers/:id",
    BULK: "/customers/bulk",
    SYNC: "/customers/sync/:platform",
    EXPORT: "/customers/export",
    ORDERS: "/customers/:id/orders",
    NOTES: "/customers/:id/notes",
    TAGS: "/customers/:id/tags",
  },
  
  // ダッシュボード関連
  DASHBOARD: {
    BASE: "/dashboard",
    WIDGETS: "/dashboard/widgets",
    WIDGET_DETAIL: "/dashboard/widgets/:id",
    SAVED: "/dashboard/saved",
    TEMPLATES: "/dashboard/templates",
  },
  
  // レポート関連
  REPORTS: {
    BASE: "/reports",
    DETAIL: "/reports/:id",
    GENERATE: "/reports/generate",
    SCHEDULE: "/reports/schedule",
    TEMPLATES: "/reports/templates",
  },
  
  // 設定関連
  SETTINGS: {
    BASE: "/settings",
    PLATFORM: "/settings/platform/:platform",
    USER: "/settings/user",
    NOTIFICATION: "/settings/notifications",
    APPEARANCE: "/settings/appearance",
    INTEGRATIONS: "/settings/integrations",
  },
  
  // 通知関連
  NOTIFICATIONS: {
    BASE: "/notifications",
    DETAIL: "/notifications/:id",
    MARK_READ: "/notifications/read",
    SETTINGS: "/notifications/settings",
  },

  // チャット分析関連
  CHAT_ANALYSIS: {
    BASE: "/chat-analysis",
    CONVERSATIONS: "/chat-analysis/conversations",
    CONVERSATION_DETAIL: "/chat-analysis/conversations/:id",
    SENTIMENT: "/chat-analysis/sentiment",
    KEYWORDS: "/chat-analysis/keywords",
    INTENTS: "/chat-analysis/intents",
  },
  
  // Amazon関連
  AMAZON: {
    BASE: "/amazon",
    PRODUCTS: "/amazon/products",
    PRODUCT_DETAIL: "/amazon/products/:id",
    ORDERS: "/amazon/orders",
    ORDER_DETAIL: "/amazon/orders/:id",
    INVENTORY: "/amazon/inventory",
    SYNC: "/amazon/sync/:resource",
    REPORTS: "/amazon/reports",
    REPORT_DETAIL: "/amazon/reports/:id",
  },
};