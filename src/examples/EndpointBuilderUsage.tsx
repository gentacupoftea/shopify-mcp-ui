/**
 * エンドポイントビルダーの使用例
 */
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  createProductsEndpoint, 
  createOrderDetailEndpoint,
  createSyncEndpoint 
} from '../services/endpoints';
import { Product, Order, APIResponse } from '../types';

/**
 * エンドポイントビルダーを活用したデータ取得コンポーネント
 */
const EndpointBuilderExample: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 商品一覧の取得
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // エンドポイントを構築
      const endpoint = createProductsEndpoint()
        .withQueryParams({
          page: 1,
          per_page: 10,
          sort_by: 'created_at',
          sort_order: 'desc',
          status: ['active']
        })
        .build();
      
      // APIリクエスト実行
      const response = await api.get<APIResponse<{ items: Product[] }>>(endpoint);
      
      if (response.success && response.data) {
        setProducts(response.data.items);
      } else {
        throw new Error(response.error?.message || '商品の取得に失敗しました');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 特定注文の詳細取得
   */
  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // 注文詳細エンドポイントを構築
      const endpoint = createOrderDetailEndpoint(orderId).build();
      
      // APIリクエスト実行
      const response = await api.get<APIResponse<Order>>(endpoint);
      
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.error?.message || '注文の取得に失敗しました');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Shopifyとの商品同期を実行
   */
  const syncShopifyProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncStatus('同期中...');
      
      // 同期エンドポイントを構築
      const endpoint = createSyncEndpoint('products', 'shopify').build();
      
      // APIリクエスト実行
      const response = await api.post<APIResponse<{ count: number }>>(endpoint);
      
      if (response.success && response.data) {
        setSyncStatus(`${response.data.count}件の商品を同期しました`);
        // 同期後に最新の商品一覧を取得
        fetchProducts();
      } else {
        throw new Error(response.error?.message || '同期に失敗しました');
      }
    } catch (err) {
      setError((err as Error).message);
      setSyncStatus('同期失敗');
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に商品一覧を取得
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">エンドポイントビルダー使用例</h1>
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 同期ステータス */}
      {syncStatus && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {syncStatus}
        </div>
      )}
      
      {/* 商品一覧セクション */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">商品一覧</h2>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            更新
          </button>
        </div>
        
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.sku}</p>
                <p className="mt-2">{product.price} {product.currency}</p>
              </div>
            ))}
            
            {products.length === 0 && (
              <p className="col-span-3 text-center text-gray-500">商品がありません</p>
            )}
          </div>
        )}
      </div>
      
      {/* Shopify同期セクション */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Shopify同期</h2>
        <button
          onClick={syncShopifyProducts}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          商品を同期する
        </button>
      </div>
      
      {/* 注文詳細取得セクション */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">注文詳細取得</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="注文ID"
            className="border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchOrderDetails(e.currentTarget.value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              fetchOrderDetails(input.value);
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            取得
          </button>
        </div>
        
        {order && (
          <div className="mt-4 border rounded p-4">
            <h3 className="font-semibold">注文番号: {order.orderNumber}</h3>
            <p>顧客: {order.customer.name}</p>
            <p>状態: {order.status}</p>
            <p>合計: {order.totalAmount} {order.currency}</p>
            <h4 className="font-semibold mt-2">注文商品:</h4>
            <ul className="list-disc list-inside">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.title} - {item.quantity}個 (単価: {item.price})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndpointBuilderExample;