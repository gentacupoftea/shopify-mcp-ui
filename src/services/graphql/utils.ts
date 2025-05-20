/**
 * GraphQL関連ユーティリティ関数
 */
import { Connection, Edge } from './schema';

/**
 * GraphQLのエッジ/ノード形式のデータをフラットな配列に変換
 * @param edges エッジの配列
 * @returns ノードの配列
 */
export function convertEdgesToArray<T>(edges: Edge<T>[]): T[] {
  return edges.map(edge => edge.node);
}

/**
 * GraphQLコネクションを配列と追加情報に分離
 * @param connection GraphQLコネクション
 * @returns [アイテムの配列, ページネーション情報]
 */
export function deconstructConnection<T>(connection: Connection<T>): [T[], {hasNextPage: boolean, endCursor: string | null}] {
  const items = convertEdgesToArray(connection.edges);
  const pagination = {
    hasNextPage: connection.pageInfo.hasNextPage,
    endCursor: connection.pageInfo.endCursor
  };
  return [items, pagination];
}

/**
 * GraphQLのページネーション結果をREST APIの形式に変換
 * @param connection GraphQLコネクション
 * @param page 現在のページ番号
 * @param perPage ページあたりのアイテム数
 * @returns REST API互換のレスポンス
 */
export function graphqlToRestPagination<T>(
  connection: Connection<T>,
  page: number,
  perPage: number
): {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
} {
  const items = convertEdgesToArray(connection.edges);
  const total = connection.totalCount || items.length;
  const totalPages = Math.ceil(total / perPage);
  
  return {
    items,
    pagination: {
      page,
      perPage,
      total,
      totalPages
    }
  };
}

/**
 * GraphQLエラーからわかりやすいエラーメッセージを生成
 * @param errors GraphQLエラーの配列
 * @returns フォーマットされたエラーメッセージ
 */
export function formatGraphQLErrors(errors: any[]): string {
  if (!errors || errors.length === 0) {
    return 'Unknown GraphQL error';
  }
  
  // 最初のエラーのメッセージを使用
  const primaryError = errors[0];
  let message = primaryError.message;
  
  // 特定のエラーコードに基づいて追加情報を提供
  if (primaryError.extensions) {
    const code = primaryError.extensions.code;
    
    if (code === 'THROTTLED') {
      message += ' (Rate limit exceeded. Please try again later.)';
    } else if (code === 'VALIDATION_ERROR') {
      message += ' (Validation failed, please check your input data.)';
    }
  }
  
  // 複数のエラーがある場合は追加情報を提供
  if (errors.length > 1) {
    message += ` (+ ${errors.length - 1} more errors)`;
  }
  
  return message;
}

/**
 * GraphQLクエリの変数からREST APIのクエリパラメータを生成
 * @param variables GraphQLクエリ変数
 * @returns REST API互換のクエリパラメータ
 */
export function graphqlVariablesToRestParams(variables: Record<string, any>): Record<string, any> {
  const params: Record<string, any> = {};
  
  // 変数からREST用のパラメータを構築
  if (variables.first) {
    params.per_page = variables.first;
  }
  
  if (variables.after) {
    params.page_info = variables.after;
  }
  
  if (variables.sortKey) {
    params.sort_by = variables.sortKey.toLowerCase();
    
    if (variables.reverse) {
      params.sort_order = 'desc';
    } else {
      params.sort_order = 'asc';
    }
  }
  
  if (variables.query) {
    params.search = variables.query;
  }
  
  if (variables.status) {
    params.status = variables.status;
  }
  
  if (variables.createdAtMin) {
    params.created_at_min = variables.createdAtMin;
  }
  
  if (variables.createdAtMax) {
    params.created_at_max = variables.createdAtMax;
  }
  
  return params;
}

/**
 * REST APIのクエリパラメータからGraphQLクエリの変数を生成
 * @param params REST APIのクエリパラメータ
 * @returns GraphQLクエリ互換の変数
 */
export function restParamsToGraphqlVariables(params: Record<string, any>): Record<string, any> {
  const variables: Record<string, any> = {};
  
  // RESTパラメータからGraphQL用の変数を構築
  if (params.per_page) {
    variables.first = params.per_page;
  }
  
  if (params.page_info) {
    variables.after = params.page_info;
  }
  
  if (params.sort_by) {
    variables.sortKey = params.sort_by.toUpperCase();
    
    if (params.sort_order && params.sort_order === 'desc') {
      variables.reverse = true;
    }
  }
  
  if (params.search) {
    variables.query = params.search;
  }
  
  if (params.status) {
    variables.status = params.status;
  }
  
  if (params.created_at_min) {
    variables.createdAtMin = params.created_at_min;
  }
  
  if (params.created_at_max) {
    variables.createdAtMax = params.created_at_max;
  }
  
  return variables;
}