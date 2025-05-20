/**
 * GraphQLバックエンド連携のテスト例
 */
import React, { useState } from 'react';
import { 
  createGraphQLEndpoint, 
  createProductsGraphQLEndpoint 
} from '../services/endpoints';
import graphqlClient from '../services/graphql/GraphQLClient';
import ShopifyGraphQLService from '../services/graphql/ShopifyGraphQLService';
import { 
  ProductsResponse, 
  OrdersResponse, 
  formatGraphQLErrors,
  deconstructConnection 
} from '../services/graphql';

// テスト用コンポーネント
const GraphQLBackendIntegration: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<string>('');

  // バックエンドGraphQLサーバーのURL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const graphqlEndpoint = `${backendUrl}/api/graphql`;
  
  // カスタムエンドポイントでのテスト実行
  const testWithCustomEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('カスタムエンドポイント');
      
      // バックエンドGraphQLエンドポイントを指定
      const endpoint = createGraphQLEndpoint(graphqlEndpoint)
        .withOperation('getProducts')
        .withOperationType('query')
        .withVariables({ first: 5 })
        .withQuery(`
          query getProducts($first: Int!) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  description
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
        `)
        .build();
      
      // リクエスト実行
      const response = await graphqlClient.execute<ProductsResponse>(endpoint);
      
      // レスポンスを表示用に変換
      const [products, pagination] = deconstructConnection(response.products);
      
      setResults({
        products,
        pagination,
        rawResponse: response
      });
    } catch (err: any) {
      console.error('GraphQL Error:', err);
      
      if (err.errors) {
        setError(formatGraphQLErrors(err.errors));
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // ShopifyGraphQLServiceを使ったテスト
  const testWithService = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('ShopifyGraphQLService');
      
      // サービスインスタンスに一時的にバックエンドURLを設定
      const tempService = new ShopifyGraphQLService(graphqlEndpoint);
      const result = await tempService.getProducts({ first: 5 });
      
      setResults({
        products: result.products,
        pagination: result.pageInfo,
        rawResponse: result
      });
    } catch (err: any) {
      console.error('Service Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // バックエンド互換性のテスト
  const testBackendCompatibility = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('バックエンド互換性');
      
      // バックエンドからサーバー情報を取得
      const endpoint = createGraphQLEndpoint(graphqlEndpoint)
        .withOperationType('query')
        .withQuery(`
          query {
            apiInfo {
              version
              environment
              supportedOperations
              timestamp
            }
          }
        `)
        .build();
      
      const response = await graphqlClient.execute(endpoint);
      
      setResults({
        apiInfo: response.apiInfo,
        rawResponse: response
      });
    } catch (err: any) {
      console.error('Compatibility Error:', err);
      
      if (err.errors) {
        setError(formatGraphQLErrors(err.errors));
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // エラーハンドリングのテスト
  const testErrorHandling = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethod('エラーハンドリング');
      
      // 故意に無効なクエリを実行
      const endpoint = createGraphQLEndpoint(graphqlEndpoint)
        .withOperationType('query')
        .withQuery(`
          query {
            nonExistentField {
              id
              name
            }
          }
        `)
        .build();
      
      const response = await graphqlClient.execute(endpoint);
      setResults(response);
    } catch (err: any) {
      console.error('Expected Error:', err);
      
      // エラーハンドリングのテストなので、エラーは成功として表示
      setResults({
        testPassed: true,
        errorCaught: true,
        errorMessage: err.message,
        errors: err.errors
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">GraphQLバックエンド連携テスト</h1>
      
      <div className="mb-4">
        <p className="mb-2">
          バックエンドGraphQLエンドポイント: <code className="bg-gray-100 px-2 py-1 rounded">{graphqlEndpoint}</code>
        </p>
        <p className="text-sm text-gray-600">
          注: バックエンドサーバーが起動していることを確認してください
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={testWithCustomEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          カスタムエンドポイントでテスト
        </button>
        
        <button
          onClick={testWithService}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          サービス経由でテスト
        </button>
        
        <button
          onClick={testBackendCompatibility}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          バックエンド互換性テスト
        </button>
        
        <button
          onClick={testErrorHandling}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          エラーハンドリングテスト
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}
      
      {method && results && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">結果 ({method})</h2>
          
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre className="text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLBackendIntegration;