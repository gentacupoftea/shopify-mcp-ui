/**
 * GraphQLとEndpointBuilderの使用例
 */
import React, { useEffect, useState } from 'react';
import { 
  createGraphQLEndpoint, 
  createProductsGraphQLEndpoint,
  createOrdersGraphQLEndpoint 
} from '../services/endpoints';
import ShopifyGraphQLService from '../services/graphql/ShopifyGraphQLService';
import graphqlClient from '../services/graphql/GraphQLClient';

// 商品タイプ
interface Product {
  id: string;
  title: string;
  description: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: string;
      }
    }>
  }
}

// 注文タイプ
interface Order {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: string;
  currencyCode: string;
}

/**
 * GraphQL使用例コンポーネント
 */
const GraphQLUsage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GraphQL APIを使用して商品を取得する例
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // 方法1: ShopifyGraphQLServiceを使用
      const result = await ShopifyGraphQLService.getProducts({ first: 10 });
      setProducts(result.products);
      
      // 方法2: EndpointBuilderを使用して直接クエリを構築
      /*
      const endpoint = createProductsGraphQLEndpoint({ first: 10 });
      const result = await graphqlClient.execute(endpoint.build());
      setProducts(result.products.edges.map(edge => edge.node));
      */
      
      // 方法3: カスタムクエリを使用
      /*
      const customQuery = `
        query {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                variants(first: 3) {
                  edges {
                    node {
                      id
                      price
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const result = await graphqlClient.query(customQuery);
      setProducts(result.products.edges.map(edge => edge.node));
      */
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // GraphQL APIを使用して注文を取得する例
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // EndpointBuilderを使用してクエリを構築
      const endpoint = createOrdersGraphQLEndpoint({ first: 5 });
      const result = await graphqlClient.execute<{
        orders: {
          edges: Array<{
            node: Order
          }>;
          pageInfo: { hasNextPage: boolean; endCursor: string };
        }
      }>(endpoint.build());
      
      setOrders(result.orders.edges.map(edge => edge.node));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // カスタムGraphQLクエリを実行する例
  const executeCustomQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      // EndpointBuilderを使用してカスタムクエリを構築
      const endpoint = createGraphQLEndpoint()
        .withOperation('getShopInfo')
        .withQuery(`
          query getShopInfo {
            shop {
              name
              primaryDomain {
                url
                host
              }
              plan {
                displayName
                partnerDevelopment
                shopifyPlus
              }
            }
          }
        `);
      
      const result = await graphqlClient.execute(endpoint.build());
      console.log('Shop Info:', result);
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // コンポーネントマウント時にデータ取得
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">GraphQL使用例</h1>
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 操作ボタン */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={fetchProducts}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          商品を取得
        </button>
        
        <button 
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          注文を取得
        </button>
        
        <button 
          onClick={executeCustomQuery}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          ショップ情報を取得
        </button>
      </div>
      
      {/* ローディング表示 */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      {/* 商品一覧 */}
      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">商品一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                {product.variants?.edges?.length > 0 && (
                  <p className="mt-2">
                    価格: {product.variants.edges[0].node.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 注文一覧 */}
      {orders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">注文一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">注文番号</th>
                  <th className="py-2 px-4 border">日付</th>
                  <th className="py-2 px-4 border">合計金額</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border">{order.name}</td>
                    <td className="py-2 px-4 border">{new Date(order.processedAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border">{order.totalPrice} {order.currencyCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLUsage;