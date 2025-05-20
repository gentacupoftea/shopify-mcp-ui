/**
 * GraphQLスキーマ型定義
 * バックエンドのGraphQL APIと一致する型定義
 */

// ページネーション情報
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

// エッジ型（ページネーション結果の各要素）
export interface Edge<T> {
  node: T;
  cursor?: string;
}

// ページネーションされた結果のコネクション
export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

// 商品型定義
export interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  vendor: string;
  productType: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  variants: Connection<ProductVariant>;
  images: Connection<ProductImage>;
  tags: string[];
}

// 商品バリアント型定義
export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  inventoryQuantity: number;
  compareAtPrice?: string;
  sku?: string;
  barcode?: string;
  availableForSale: boolean;
  requiresShipping: boolean;
  taxable: boolean;
  weight: number;
  weightUnit: string;
  image?: ProductImage;
}

// 商品画像型定義
export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

// 注文型定義
export interface Order {
  id: string;
  name: string;
  email?: string;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  subtotalPrice: string;
  totalTax: string;
  currencyCode: string;
  customer?: Customer;
  shippingAddress?: Address;
  billingAddress?: Address;
  lineItems: Connection<LineItem>;
  tags: string[];
}

// 注文商品型定義
export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  price: string;
  totalPrice: string;
  taxable: boolean;
  requiresShipping: boolean;
  variant?: ProductVariant;
  product?: Product;
}

// 顧客型定義
export interface Customer {
  id: string;
  displayName: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  addresses: Connection<Address>;
  defaultAddress?: Address;
  orders: Connection<Order>;
  tags: string[];
}

// 住所型定義
export interface Address {
  id?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
}

// GraphQLクエリ変数型定義
export interface ProductsQueryVariables {
  first?: number;
  after?: string | null;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}

export interface OrdersQueryVariables {
  first?: number;
  after?: string | null;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  status?: string;
  createdAtMin?: string;
  createdAtMax?: string;
}

export interface CustomersQueryVariables {
  first?: number;
  after?: string | null;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}

// レスポンス型定義
export interface ProductsResponse {
  products: Connection<Product>;
}

export interface OrdersResponse {
  orders: Connection<Order>;
}

export interface CustomersResponse {
  customers: Connection<Customer>;
}

// 単一リソース取得用レスポンス型定義
export interface ProductResponse {
  product: Product;
}

export interface OrderResponse {
  order: Order;
}

export interface CustomerResponse {
  customer: Customer;
}

// 共通のミューテーション結果
export interface UserError {
  field: string[];
  message: string;
}

export interface MutationResponse<T> {
  userErrors: UserError[];
  result?: T;
}

// エラー型
export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: string[];
  extensions?: Record<string, any>;
}