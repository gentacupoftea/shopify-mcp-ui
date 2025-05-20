/**
 * エンドポイントビルダー
 * APIエンドポイントを構築するためのユーティリティクラス
 */
import { ECPlatform } from "@/types";

export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, string | number | boolean | string[] | undefined>;

/**
 * APIエンドポイント用のパス構築クラス
 */
export class EndpointBuilder {
  private basePath: string;
  private pathParams: PathParams = {};
  private queryParams: QueryParams = {};
  private version: string;

  /**
   * コンストラクタ
   * @param basePath ベースとなるAPIパス
   * @param version APIバージョン (例: "v1")
   */
  constructor(basePath: string, version: string = "v1") {
    this.basePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    this.version = version;
  }

  /**
   * APIのバージョンを設定
   * @param version APIバージョン
   * @returns this インスタンス（チェーン用）
   */
  public withVersion(version: string): EndpointBuilder {
    this.version = version;
    return this;
  }

  /**
   * パスパラメータを追加
   * @param params パスパラメータオブジェクト
   * @returns this インスタンス（チェーン用）
   */
  public withPathParams(params: PathParams): EndpointBuilder {
    this.pathParams = { ...this.pathParams, ...params };
    return this;
  }

  /**
   * クエリパラメータを追加
   * @param params クエリパラメータオブジェクト
   * @returns this インスタンス（チェーン用）
   */
  public withQueryParams(params: QueryParams): EndpointBuilder {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * IDを含むパスを追加
   * @param id リソースID
   * @returns this インスタンス（チェーン用）
   */
  public withId(id: string | number): EndpointBuilder {
    return this.withPathParams({ id });
  }

  /**
   * プラットフォーム固有エンドポイントを設定
   * @param platform ECプラットフォーム
   * @returns this インスタンス（チェーン用）
   */
  public withPlatform(platform: ECPlatform): EndpointBuilder {
    return this.withPathParams({ platform });
  }

  /**
   * サブリソースパスを追加
   * @param subResource サブリソースパス
   * @returns this インスタンス（チェーン用）
   */
  public withSubResource(subResource: string): EndpointBuilder {
    this.basePath = `${this.basePath}/${subResource}`;
    return this;
  }

  /**
   * 特定アクションのパスを追加
   * @param action アクション名
   * @returns this インスタンス（チェーン用）
   */
  public withAction(action: string): EndpointBuilder {
    this.basePath = `${this.basePath}/${action}`;
    return this;
  }

  /**
   * クエリパラメータのエンコード処理
   * @param params クエリパラメータオブジェクト
   * @returns クエリ文字列
   */
  private encodeQueryParams(params: QueryParams): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        // 配列パラメータの処理 (例: tags[]=a&tags[]=b)
        for (const item of value) {
          parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(String(item))}`);
        }
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }

    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }

  /**
   * パスパラメータの置換処理
   * @param path テンプレートパス
   * @param params パスパラメータ
   * @returns 変換済みパス
   */
  private replacePlaceholders(path: string, params: PathParams): string {
    let result = path;
    
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(`:${key}`, String(value));
    }
    
    return result;
  }

  /**
   * 最終的なエンドポイントURLを構築
   * @returns 完全なエンドポイントURL
   */
  public build(): string {
    // APIバージョンを含めたパスの構築
    let path = `/api/${this.version}${this.basePath}`;
    
    // パスパラメータの置換処理
    path = this.replacePlaceholders(path, this.pathParams);
    
    // クエリパラメータの追加
    const queryString = this.encodeQueryParams(this.queryParams);
    
    return `${path}${queryString}`;
  }

  /**
   * 現在のビルダーをクローンして新しいインスタンスを作成
   * @returns 新しいEndpointBuilderインスタンス
   */
  public clone(): EndpointBuilder {
    const cloned = new EndpointBuilder(this.basePath, this.version);
    cloned.pathParams = { ...this.pathParams };
    cloned.queryParams = { ...this.queryParams };
    return cloned;
  }
}