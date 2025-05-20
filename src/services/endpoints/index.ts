/**
 * エンドポイントビルダー関連のエクスポート
 */
import { EndpointBuilder, PathParams, QueryParams } from "./EndpointBuilder";
import { GraphQLEndpointBuilder, GraphQLOperation, Variables, GraphQLRequest } from "./GraphQLEndpointBuilder";
import { ENDPOINTS, API_VERSION, GRAPHQL_ENDPOINT } from "./constants";
import { ECPlatform } from "@/types";

// REST APIエンドポイントビルダー

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
 * Amazon関連エンドポイントビルダーを作成
 */
export function createAmazonEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.AMAZON.BASE, API_VERSION);
}

/**
 * Amazon特定リソースエンドポイントビルダーを作成
 */
export function createAmazonResourceEndpoint(resource: "products" | "orders" | "inventory" | "reports"): EndpointBuilder {
  // リソースタイプに対応するパスを取得
  let basePath = `${ENDPOINTS.AMAZON.BASE}/${resource}`;
  
  // リソースに対応する特定のパスが定義されている場合はそれを使用
  if (resource === "products") {
    basePath = ENDPOINTS.AMAZON.PRODUCTS;
  } else if (resource === "orders") {
    basePath = ENDPOINTS.AMAZON.ORDERS;
  } else if (resource === "inventory") {
    basePath = ENDPOINTS.AMAZON.INVENTORY;
  } else if (resource === "reports") {
    basePath = ENDPOINTS.AMAZON.REPORTS;
  }
  
  return new EndpointBuilder(basePath, API_VERSION);
}

/**
 * Amazon同期エンドポイントビルダーを作成
 */
export function createAmazonSyncEndpoint(resource: "products" | "orders" | "inventory"): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.AMAZON.SYNC, API_VERSION)
    .withPathParams({ resource });
}

// GraphQLエンドポイントビルダー

/**
 * GraphQLエンドポイントビルダーを作成
 * @param customEndpoint カスタムGraphQLエンドポイント（指定しない場合はデフォルトエンドポイントを使用）
 * @returns GraphQLエンドポイントビルダー
 */
export function createGraphQLEndpoint(customEndpoint?: string): GraphQLEndpointBuilder {
  return new GraphQLEndpointBuilder(customEndpoint || GRAPHQL_ENDPOINT);
}

/**
 * 商品取得用GraphQLエンドポイントビルダーを作成
 * @param variables クエリ変数
 * @returns GraphQLエンドポイントビルダー
 */
export function createProductsGraphQLEndpoint(variables?: Variables): GraphQLEndpointBuilder {
  return createGraphQLEndpoint()
    .withOperation('getProducts')
    .withOperationType('query')
    .withVariables(variables || { first: 10 })
    .withQuery(`
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              description
              createdAt
              updatedAt
              tags
              variants {
                edges {
                  node {
                    id
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `);
}

/**
 * 注文取得用GraphQLエンドポイントビルダーを作成
 * @param variables クエリ変数
 * @returns GraphQLエンドポイントビルダー
 */
export function createOrdersGraphQLEndpoint(variables?: Variables): GraphQLEndpointBuilder {
  return createGraphQLEndpoint()
    .withOperation('getOrders')
    .withOperationType('query')
    .withVariables(variables || { first: 10 })
    .withQuery(`
      query getOrders($first: Int!, $after: String) {
        orders(first: $first, after: $after) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice
              currencyCode
              customer {
                id
                email
                firstName
                lastName
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `);
}

/**
 * 顧客取得用GraphQLエンドポイントビルダーを作成
 * @param variables クエリ変数
 * @returns GraphQLエンドポイントビルダー
 */
export function createCustomersGraphQLEndpoint(variables?: Variables): GraphQLEndpointBuilder {
  return createGraphQLEndpoint()
    .withOperation('getCustomers')
    .withOperationType('query')
    .withVariables(variables || { first: 10 })
    .withQuery(`
      query getCustomers($first: Int!, $after: String) {
        customers(first: $first, after: $after) {
          edges {
            node {
              id
              email
              firstName
              lastName
              orders(first: 5) {
                edges {
                  node {
                    id
                    name
                    totalPrice
                    processedAt
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `);
}

// エンドポイントビルダーと定数をエクスポート
export { EndpointBuilder, GraphQLEndpointBuilder, ENDPOINTS, API_VERSION, GRAPHQL_ENDPOINT };
export type { PathParams, QueryParams, GraphQLOperation, Variables, GraphQLRequest };