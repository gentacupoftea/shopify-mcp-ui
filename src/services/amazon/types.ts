/**
 * Amazon Selling Partner API 関連の型定義
 */

/**
 * Amazon SP-API認証設定
 */
export interface AmazonAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * AWS認証情報
 */
export interface AWSCredentials {
  accessKey: string;
  secretKey: string;
  region: string;
  roleArn?: string;
}

/**
 * Amazon SP-API設定
 */
export interface AmazonSPAPIConfig {
  auth: AmazonAuthConfig;
  aws: AWSCredentials;
  sandbox?: boolean;
}

/**
 * サポートされるAmazonリージョン
 */
export enum AmazonRegion {
  NA = 'na', // 北米
  EU = 'eu', // ヨーロッパ
  FE = 'fe', // 極東
}

/**
 * サポートされるAmazonマーケットプレイス
 */
export enum AmazonMarketplace {
  US = 'ATVPDKIKX0DER',        // アメリカ
  CA = 'A2EUQ1WTGCTBG2',       // カナダ
  MX = 'A1AM78C64UM0Y8',       // メキシコ
  BR = 'A2Q3Y263D00KWC',       // ブラジル
  UK = 'A1F83G8C2ARO7P',       // イギリス
  DE = 'A1PA6795UKMFR9',       // ドイツ
  FR = 'A13V1IB3VIYZZH',       // フランス
  IT = 'APJ6JRA9NG5V4',        // イタリア
  ES = 'A1RKKUPIHCS9HS',       // スペイン
  JP = 'A1VC38T7YXB528',       // 日本
  AU = 'A39IBJ37TRP1C6',       // オーストラリア
  AE = 'A2VIGQ35RCS4UG',       // アラブ首長国連邦
  IN = 'A21TJRUUN4KGV',        // インド
  SG = 'A19VAU5U5O7RUS',       // シンガポール
}

/**
 * LWA (Login with Amazon) トークンレスポンス
 */
export interface LWATokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

/**
 * Amazon API エラーレスポンス
 */
export interface AmazonErrorResponse {
  errors?: Array<{
    code: string;
    message: string;
    details?: string;
  }>;
}

/**
 * 注文ステータス
 */
export enum OrderStatus {
  PENDING = 'Pending',
  UNSHIPPED = 'Unshipped',
  PARTIALLY_SHIPPED = 'PartiallyShipped',
  SHIPPED = 'Shipped',
  CANCELED = 'Canceled',
  UNFULFILLABLE = 'Unfulfillable',
  INVOICE_UNCONFIRMED = 'InvoiceUnconfirmed',
  PENDING_AVAILABILITY = 'PendingAvailability',
}

/**
 * フルフィルメントチャネル
 */
export enum FulfillmentChannel {
  MFN = 'MFN', // Merchant Fulfilled Network (セラー出荷)
  AFN = 'AFN', // Amazon Fulfilled Network (FBA)
}

/**
 * 支払い方法
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CreditCard',
  COD = 'COD', // Cash On Delivery (代金引換)
  DIRECT_DEBIT = 'DirectDebit',
  GIFT_CARD = 'GiftCard',
  POINTS = 'Points',
  STORE_CREDIT = 'StoreCredit',
  INVOICE = 'Invoice',
  OTHER = 'Other',
}

/**
 * 注文タイプ
 */
export enum OrderType {
  STANDARD = 'StandardOrder',
  PRIME = 'SourcingOnDemandOrder',
  PREORDER = 'MergedOrder',
  BUSINESS = 'BusinessOrder',
}