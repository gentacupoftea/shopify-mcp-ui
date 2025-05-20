/**
 * Shopify GraphQLサービス
 * GraphQLを使用してShopify APIにアクセスするサービス
 */
import graphqlClient from './GraphQLClient';
import { 
  createProductsGraphQLEndpoint, 
  createOrdersGraphQLEndpoint,
  createCustomersGraphQLEndpoint
} from '../endpoints';

/**
 * ページ情報インターフェース
 */
interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

/**
 * ページネーション用パラメータ
 */
interface PaginationParams {
  first?: number;
  after?: string;
}

/**
 * Shopify GraphQL APIサービスクラス
 */
class ShopifyGraphQLService {
  /**
   * 商品一覧を取得
   * @param params ページネーションパラメータ
   * @returns 商品データと次ページ情報
   */
  async getProducts(params: PaginationParams = { first: 20 }) {
    const { first = 20, after } = params;
    
    const endpoint = createProductsGraphQLEndpoint({ first, after });
    const result = await graphqlClient.execute<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            tags: string[];
            variants: {
              edges: Array<{
                node: {
                  id: string;
                  price: string;
                  inventoryQuantity: number;
                }
              }>
            }
          }
        }>;
        pageInfo: PageInfo;
      }
    }>(endpoint.build());
    
    // データを整形して返却
    const products = result.products.edges.map(edge => edge.node);
    const pageInfo = result.products.pageInfo;
    
    return {
      products,
      pageInfo
    };
  }
  
  /**
   * 注文一覧を取得
   * @param params ページネーションパラメータ
   * @returns 注文データと次ページ情報
   */
  async getOrders(params: PaginationParams = { first: 20 }) {
    const { first = 20, after } = params;
    
    const endpoint = createOrdersGraphQLEndpoint({ first, after });
    const result = await graphqlClient.execute<{
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            processedAt: string;
            financialStatus: string;
            fulfillmentStatus: string;
            totalPrice: string;
            currencyCode: string;
            customer: {
              id: string;
              email: string;
              firstName: string;
              lastName: string;
            }
          }
        }>;
        pageInfo: PageInfo;
      }
    }>(endpoint.build());
    
    // データを整形して返却
    const orders = result.orders.edges.map(edge => edge.node);
    const pageInfo = result.orders.pageInfo;
    
    return {
      orders,
      pageInfo
    };
  }
  
  /**
   * 顧客一覧を取得
   * @param params ページネーションパラメータ
   * @returns 顧客データと次ページ情報
   */
  async getCustomers(params: PaginationParams = { first: 20 }) {
    const { first = 20, after } = params;
    
    const endpoint = createCustomersGraphQLEndpoint({ first, after });
    const result = await graphqlClient.execute<{
      customers: {
        edges: Array<{
          node: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            orders: {
              edges: Array<{
                node: {
                  id: string;
                  name: string;
                  totalPrice: string;
                  processedAt: string;
                }
              }>
            }
          }
        }>;
        pageInfo: PageInfo;
      }
    }>(endpoint.build());
    
    // データを整形して返却
    const customers = result.customers.edges.map(edge => edge.node);
    const pageInfo = result.customers.pageInfo;
    
    return {
      customers,
      pageInfo
    };
  }
  
  /**
   * カスタムGraphQLクエリを実行
   * @param query GraphQLクエリ
   * @param variables クエリ変数
   * @returns クエリ結果
   */
  async executeQuery<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    return graphqlClient.query<T>(query, variables);
  }
  
  /**
   * カスタムGraphQLミューテーションを実行
   * @param mutation GraphQLミューテーション
   * @param variables ミューテーション変数
   * @returns ミューテーション結果
   */
  async executeMutation<T = any>(mutation: string, variables?: Record<string, any>): Promise<T> {
    return graphqlClient.mutate<T>(mutation, variables);
  }
}

export default new ShopifyGraphQLService();