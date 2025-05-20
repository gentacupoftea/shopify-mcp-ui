/**
 * Shopify GraphQLサービス
 * GraphQLを使用してShopify APIにアクセスするサービス
 */
import graphqlClient, { GraphQLClient } from './GraphQLClient';
import { 
  checkWritePermission, 
  createWriteBlockedError,
  logApiOperation 
} from '../../config/api-security';
import { 
  createProductsGraphQLEndpoint, 
  createOrdersGraphQLEndpoint,
  createCustomersGraphQLEndpoint,
  createGraphQLEndpoint
} from '../endpoints';

import { 
  PageInfo, 
  ProductsResponse, 
  OrdersResponse, 
  CustomersResponse 
} from './schema';

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
  private client: GraphQLClient;
  private endpoint: string;
  
  /**
   * コンストラクタ
   * @param endpoint カスタムGraphQLエンドポイント (デフォルトはグローバルクライアントを使用)
   */
  constructor(endpoint?: string) {
    this.endpoint = endpoint || '/api/graphql';
    this.client = endpoint ? new GraphQLClient(endpoint) : graphqlClient;
  }
  /**
   * 商品一覧を取得
   * @param params ページネーションパラメータ
   * @returns 商品データと次ページ情報
   */
  async getProducts(params: PaginationParams = { first: 20 }) {
    const { first = 20, after } = params;
    
    const endpoint = createGraphQLEndpoint(this.endpoint)
      .withQuery(createProductsGraphQLEndpoint({ first, after }).build().query)
      .withVariables({ first, after });
      
    const result = await this.client.execute<ProductsResponse>(endpoint.build());
    
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
    
    const endpoint = createGraphQLEndpoint(this.endpoint)
      .withQuery(createOrdersGraphQLEndpoint({ first, after }).build().query)
      .withVariables({ first, after });
      
    const result = await this.client.execute<OrdersResponse>(endpoint.build());
    
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
    
    const endpoint = createGraphQLEndpoint(this.endpoint)
      .withQuery(createCustomersGraphQLEndpoint({ first, after }).build().query)
      .withVariables({ first, after });
      
    const result = await this.client.execute<CustomersResponse>(endpoint.build());
    
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
    return this.client.query<T>(query, variables);
  }
  
  /**
   * カスタムGraphQLミューテーションを実行
   * @param mutation GraphQLミューテーション
   * @param variables ミューテーション変数
   * @param operationName 操作名
   * @returns ミューテーション結果
   */
  async executeMutation<T = any>(
    mutation: string, 
    variables?: Record<string, any>,
    operationName: string = 'executeMutation'
  ): Promise<T> {
    // 書き込み権限のチェック
    const isAllowed = checkWritePermission('shopify', operationName);
    logApiOperation('shopify', 'MUTATION', operationName, isAllowed);
    
    // 権限が無い場合はエラーをスロー
    if (!isAllowed) {
      throw createWriteBlockedError('shopify', operationName);
    }
    
    return this.client.mutate<T>(mutation, variables, undefined, operationName);
  }
  
  /**
   * カスタムエンドポイントを設定
   * @param endpoint GraphQLエンドポイントURL
   */
  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
    this.client = new GraphQLClient(endpoint);
  }
}

export default new ShopifyGraphQLService();