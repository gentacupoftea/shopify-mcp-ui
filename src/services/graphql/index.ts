/**
 * GraphQL関連モジュールのエクスポート
 */
import graphqlClient, { GraphQLClient, GraphQLResponse, GraphQLError } from './GraphQLClient';
import ShopifyGraphQLService from './ShopifyGraphQLService';
import * as schema from './schema';
import * as utils from './utils';

export { 
  graphqlClient,
  GraphQLClient,
  ShopifyGraphQLService,
  schema,
  utils
};

export type { 
  GraphQLResponse 
};

export { 
  GraphQLError 
};

// スキーマ型をエクスポート
export type {
  PageInfo,
  Edge,
  Connection,
  Product,
  ProductVariant,
  ProductImage,
  Order,
  LineItem,
  Customer,
  Address,
  ProductsQueryVariables,
  OrdersQueryVariables,
  CustomersQueryVariables,
  ProductsResponse,
  OrdersResponse,
  CustomersResponse,
  ProductResponse,
  OrderResponse,
  CustomerResponse,
  UserError,
  MutationResponse,
  GraphQLErrorLocation
} from './schema';