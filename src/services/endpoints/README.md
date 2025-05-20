# エンドポイントビルダー

APIエンドポイントを構築するためのユーティリティクラスと関数群です。

## 概要

このモジュールはAPIエンドポイントを構造的かつ型安全に構築するための機能を提供します。
RESTエンドポイントとGraphQLの両方をサポートしており、以下のメリットがあります：

- 文字列連結よりも型安全なAPIエンドポイント構築
- パスパラメータやクエリパラメータの簡単な追加
- エンドポイント構造をコード内で統一
- GraphQLクエリ構築のサポート
- コンポーネント間での再利用が容易

## 基本的な使い方

### RESTエンドポイントビルダーの使用

```typescript
import { createProductsEndpoint } from './services/endpoints';

// 基本的なエンドポイント構築
const endpoint = createProductsEndpoint()
  .withQueryParams({ page: 1, limit: 10 })
  .build();

// 結果: /api/v1/products?page=1&limit=10
```

### GraphQLエンドポイントビルダーの使用

```typescript
import { createGraphQLEndpoint } from './services/endpoints';
import graphqlClient from './services/graphql/GraphQLClient';

// GraphQLクエリの構築
const endpoint = createGraphQLEndpoint()
  .withOperation('getProducts')
  .withVariables({ first: 10 })
  .withQuery(`
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `)
  .build();

// GraphQLクエリの実行
const result = await graphqlClient.execute(endpoint);
```

### 事前定義されたGraphQLエンドポイント

```typescript
import { createProductsGraphQLEndpoint } from './services/endpoints';
import graphqlClient from './services/graphql/GraphQLClient';

// 商品取得用のGraphQLエンドポイント
const endpoint = createProductsGraphQLEndpoint({ first: 10 });
const result = await graphqlClient.execute(endpoint.build());
```

### ShopifyGraphQLサービスの使用

```typescript
import { ShopifyGraphQLService } from './services/graphql';

// 商品データの取得
const { products, pageInfo } = await ShopifyGraphQLService.getProducts({ first: 10 });

// 次のページがある場合
if (pageInfo.hasNextPage) {
  const nextPage = await ShopifyGraphQLService.getProducts({ 
    first: 10, 
    after: pageInfo.endCursor 
  });
}
```

## 高度な使い方

### パスパラメータの追加

```typescript
import { EndpointBuilder } from './services/endpoints';

// パスパラメータを持つエンドポイント
const endpoint = new EndpointBuilder('/orders/:id/items/:itemId', 'v1')
  .withPathParams({ 
    id: '12345', 
    itemId: '67890' 
  })
  .build();

// 結果: /api/v1/orders/12345/items/67890
```

### RESTエンドポイントの拡張

```typescript
import { createProductsEndpoint } from './services/endpoints';

// サブリソースやアクションの追加
const endpoint = createProductsEndpoint()
  .withId('12345')
  .withSubResource('variants')
  .withAction('reorder')
  .build();

// 結果: /api/v1/products/12345/variants/reorder
```

### カスタムGraphQLクエリ

```typescript
import { createGraphQLEndpoint } from './services/endpoints';

// カスタムGraqhQLクエリの構築
const endpoint = createGraphQLEndpoint()
  .withOperation('getShopInfo')
  .withQuery(`
    query getShopInfo {
      shop {
        name
        primaryDomain {
          url
        }
        plan {
          displayName
        }
      }
    }
  `)
  .build();
```

## ファイル構成

- `EndpointBuilder.ts` - RESTエンドポイントビルダークラスの実装
- `GraphQLEndpointBuilder.ts` - GraphQLエンドポイントビルダークラスの実装
- `constants.ts` - 共通エンドポイント定義
- `index.ts` - ファクトリ関数と型のエクスポート
- `../graphql/GraphQLClient.ts` - GraphQLクライアントの実装
- `../graphql/ShopifyGraphQLService.ts` - Shopify GraphQL APIサービス

## 主要な型定義

```typescript
// RESTエンドポイント用の型
export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, string | number | boolean | string[] | undefined>;

// GraphQLエンドポイント用の型
export type GraphQLOperation = 'query' | 'mutation';
export type Variables = Record<string, any>;

export interface GraphQLRequest {
  endpoint: string;
  operationType: GraphQLOperation;
  operationName: string;
  query: string;
  variables: Variables;
  headers: Record<string, string>;
}
```

## カスタムエンドポイントの追加方法

1. `constants.ts`にエンドポイント定義を追加
2. `index.ts`にファクトリ関数を追加
3. 必要に応じて固有のファクトリ関数を作成

```typescript
// constants.tsに追加
export const ENDPOINTS = {
  // ...
  INVENTORY: {
    BASE: "/inventory",
    DETAIL: "/inventory/:id",
  },
};

// index.tsに追加
export function createInventoryEndpoint(): EndpointBuilder {
  return new EndpointBuilder(ENDPOINTS.INVENTORY.BASE, API_VERSION);
}
```

## GraphQLとRESTの連携

GraphQLのデータをREST互換形式に変換するヘルパー関数の例：

```typescript
/**
 * GraphQLのエッジ/ノード形式のデータをフラットな配列に変換
 */
export function convertEdgesToArray<T>(
  edges: Array<{ node: T }>
): T[] {
  return edges.map(edge => edge.node);
}

// 使用例
const result = await ShopifyGraphQLService.getProducts({ first: 10 });
const products = convertEdgesToArray(result.products.edges);
```