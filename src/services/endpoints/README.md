# エンドポイントビルダー

APIエンドポイントを構築するためのユーティリティクラスと関数群です。

## 概要

このモジュールはAPIエンドポイントを構造的かつ型安全に構築するための機能を提供します。
エンドポイントビルダーを使用することで、以下のメリットがあります：

- 文字列連結よりも型安全なAPIエンドポイント構築
- パスパラメータやクエリパラメータの簡単な追加
- エンドポイント構造をコード内で統一
- コンポーネント間での再利用が容易

## 基本的な使い方

### エンドポイントビルダーの直接使用

```typescript
import { EndpointBuilder } from './services/endpoints';

// 基本的なエンドポイント構築
const endpoint = new EndpointBuilder('/products', 'v1')
  .withQueryParams({ page: 1, limit: 10 })
  .build();

// 結果: /api/v1/products?page=1&limit=10
```

### ファクトリ関数の使用

```typescript
import { createProductsEndpoint, createOrderDetailEndpoint } from './services/endpoints';

// 商品一覧エンドポイント
const productsEndpoint = createProductsEndpoint()
  .withQueryParams({ status: ['active', 'draft'] })
  .build();

// 注文詳細エンドポイント
const orderEndpoint = createOrderDetailEndpoint('order123')
  .build();
```

### APIサービスとの組み合わせ

```typescript
import api from './services/api';
import { createProductsEndpoint } from './services/endpoints';
import { Product, APIResponse } from './types';

async function fetchProducts() {
  const endpoint = createProductsEndpoint()
    .withQueryParams({
      page: 1,
      perPage: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    .build();
    
  const response = await api.get<APIResponse<Product[]>>(endpoint);
  return response.data;
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

### エンドポイントの拡張

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

### クエリパラメータの配列

```typescript
import { createProductsEndpoint } from './services/endpoints';

// 配列パラメータの使用
const endpoint = createProductsEndpoint()
  .withQueryParams({
    status: ['active', 'draft'],
    tags: ['featured', 'new']
  })
  .build();

// 結果: /api/v1/products?status[]=active&status[]=draft&tags[]=featured&tags[]=new
```

## ファイル構成

- `EndpointBuilder.ts` - エンドポイントビルダークラスの実装
- `constants.ts` - 共通エンドポイント定義
- `index.ts` - ファクトリ関数と型のエクスポート

## 型定義

主要な型定義：

```typescript
// パスパラメータ型
export type PathParams = Record<string, string | number>;

// クエリパラメータ型
export type QueryParams = Record<string, string | number | boolean | string[] | undefined>;
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