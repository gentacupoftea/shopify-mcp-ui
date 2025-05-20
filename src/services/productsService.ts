/**
 * 商品関連サービス
 */
import api from "./api";
import { Product, PaginationParams, FilterParams, APIResponse, ECPlatform } from "@/types";
import { 
  createProductsEndpoint, 
  createProductDetailEndpoint,
  createSyncEndpoint 
} from "./endpoints";

interface ProductsResponse {
  items: Product[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

class ProductsService {
  /**
   * 商品一覧取得
   */
  async getProducts(
    pagination: PaginationParams,
    filters: FilterParams,
  ): Promise<ProductsResponse> {
    // エンドポイントビルダーを使用
    const endpoint = createProductsEndpoint()
      .withQueryParams({
        page: pagination.page,
        per_page: pagination.perPage,
        sort_by: pagination.sortBy,
        sort_order: pagination.sortOrder,
        ...filters,
      })
      .build();

    const response = await api.get<APIResponse<ProductsResponse>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "商品の取得に失敗しました");
  }

  /**
   * 商品詳細取得
   */
  async getProductById(id: string): Promise<Product> {
    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(id).build();

    const response = await api.get<APIResponse<Product>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "商品の取得に失敗しました");
  }

  /**
   * 商品作成
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    // エンドポイントビルダーを使用
    const endpoint = createProductsEndpoint().build();

    const response = await api.post<APIResponse<Product>>(endpoint, data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "商品の作成に失敗しました");
  }

  /**
   * 商品更新
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(id).build();

    const response = await api.put<APIResponse<Product>>(endpoint, data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "商品の更新に失敗しました");
  }

  /**
   * 商品削除
   */
  async deleteProduct(id: string): Promise<void> {
    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(id).build();

    const response = await api.delete<APIResponse<void>>(endpoint);

    if (!response.success) {
      throw new Error(response.error?.message || "商品の削除に失敗しました");
    }
  }

  /**
   * 商品同期
   */
  async syncProducts(platform: ECPlatform): Promise<ProductsResponse> {
    // エンドポイントビルダーを使用
    const endpoint = createSyncEndpoint("products", platform).build();

    const response = await api.post<APIResponse<ProductsResponse>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "商品の同期に失敗しました");
  }

  /**
   * 商品エクスポート
   */
  async exportProducts(
    format: "csv" | "excel",
    filters?: FilterParams,
  ): Promise<Blob> {
    // エンドポイントビルダーを使用
    const endpoint = createProductsEndpoint()
      .withSubResource("export")
      .withQueryParams({
        format,
        ...filters,
      })
      .build();

    const response = await api.get(endpoint, {
      responseType: "blob",
    });

    return response as unknown as Blob;
  }

  /**
   * 商品インポート
   */
  async importProducts(
    file: File,
    platform: ECPlatform,
  ): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("platform", platform);

    // エンドポイントビルダーを使用
    const endpoint = createProductsEndpoint()
      .withSubResource("import")
      .build();

    const response = await api.post<
      APIResponse<{ imported: number; errors: any[] }>
    >(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(
      response.error?.message || "商品のインポートに失敗しました",
    );
  }

  /**
   * 商品画像アップロード
   */
  async uploadImage(productId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(productId)
      .withSubResource("images")
      .build();

    const response = await api.post<APIResponse<{ url: string }>>(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.success && response.data) {
      return response.data.url;
    }

    throw new Error(
      response.error?.message || "画像のアップロードに失敗しました",
    );
  }

  /**
   * 商品画像削除
   */
  async deleteImage(productId: string, imageUrl: string): Promise<void> {
    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(productId)
      .withSubResource("images")
      .build();

    const response = await api.delete<APIResponse<void>>(
      endpoint,
      {
        data: { imageUrl },
      },
    );

    if (!response.success) {
      throw new Error(response.error?.message || "画像の削除に失敗しました");
    }
  }

  /**
   * 在庫更新
   */
  async updateInventory(
    productId: string,
    inventory: number,
  ): Promise<Product> {
    // エンドポイントビルダーを使用
    const endpoint = createProductDetailEndpoint(productId)
      .withSubResource("inventory")
      .build();

    const response = await api.patch<APIResponse<Product>>(
      endpoint,
      { inventory },
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || "在庫の更新に失敗しました");
  }

  /**
   * 一括ステータス更新
   */
  async bulkUpdateStatus(
    productIds: string[],
    status: "active" | "draft" | "archived",
  ): Promise<{ updated: number }> {
    // エンドポイントビルダーを使用
    const endpoint = createProductsEndpoint()
      .withSubResource("bulk")
      .withSubResource("status")
      .build();

    const response = await api.post<APIResponse<{ updated: number }>>(
      endpoint,
      {
        productIds,
        status,
      },
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(
      response.error?.message || "ステータスの更新に失敗しました",
    );
  }
}

export default new ProductsService();