/**
 * GraphQLエンドポイントビルダー
 * GraphQLクエリとミューテーションを構築するためのユーティリティクラス
 */

export type GraphQLOperation = 'query' | 'mutation';
export type Variables = Record<string, any>;

/**
 * GraphQLリクエスト用のエンドポイント構築クラス
 */
export class GraphQLEndpointBuilder {
  private endpoint: string;
  private operation: GraphQLOperation = 'query';
  private operationName: string = '';
  private variables: Variables = {};
  private fragment: string = '';
  private query: string = '';
  private customHeaders: Record<string, string> = {};

  /**
   * コンストラクタ
   * @param endpoint GraphQLエンドポイントURL
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * 操作タイプを設定（queryまたはmutation）
   * @param operation 操作タイプ
   * @returns this インスタンス（チェーン用）
   */
  public withOperationType(operation: GraphQLOperation): GraphQLEndpointBuilder {
    this.operation = operation;
    return this;
  }

  /**
   * 操作名を設定
   * @param name 操作名
   * @returns this インスタンス（チェーン用）
   */
  public withOperation(name: string): GraphQLEndpointBuilder {
    this.operationName = name;
    return this;
  }

  /**
   * 変数を設定
   * @param variables 変数オブジェクト
   * @returns this インスタンス（チェーン用）
   */
  public withVariables(variables: Variables): GraphQLEndpointBuilder {
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  /**
   * クエリフラグメントを設定
   * @param fragment フラグメント定義
   * @returns this インスタンス（チェーン用）
   */
  public withFragment(fragment: string): GraphQLEndpointBuilder {
    this.fragment = fragment;
    return this;
  }

  /**
   * 生のGraphQLクエリを設定
   * @param query GraphQLクエリ文字列
   * @returns this インスタンス（チェーン用）
   */
  public withQuery(query: string): GraphQLEndpointBuilder {
    this.query = query;
    return this;
  }

  /**
   * カスタムヘッダーを設定
   * @param headers ヘッダーオブジェクト
   * @returns this インスタンス（チェーン用）
   */
  public withHeaders(headers: Record<string, string>): GraphQLEndpointBuilder {
    this.customHeaders = { ...this.customHeaders, ...headers };
    return this;
  }

  /**
   * GraphQLリクエストオブジェクトを構築
   * @returns GraphQLリクエストオブジェクト
   */
  public build(): GraphQLRequest {
    return {
      endpoint: this.endpoint,
      operationType: this.operation,
      operationName: this.operationName,
      query: this.getQueryString(),
      variables: this.variables,
      headers: this.customHeaders
    };
  }

  /**
   * GraphQLクエリ文字列を取得
   * @returns クエリ文字列
   * @private
   */
  private getQueryString(): string {
    // 生のクエリが設定されている場合はそれを使用
    if (this.query) {
      return this.query;
    }

    // 基本的なクエリ構造を構築
    let queryString = `${this.operation} ${this.operationName}`;

    // 変数があれば変数定義を追加
    if (Object.keys(this.variables).length > 0) {
      queryString += '(';
      const variableDefs = Object.keys(this.variables).map(key => {
        return `$${key}: ${this.getTypeForVariable(this.variables[key])}`;
      });
      queryString += variableDefs.join(', ');
      queryString += ')';
    }

    // クエリの本体はダミーとして設定（実際の使用ではwithQueryで詳細なクエリを設定する必要がある）
    queryString += ' { ' + this.operationName;
    
    // 変数があれば変数を渡す
    if (Object.keys(this.variables).length > 0) {
      queryString += '(';
      const variableUsage = Object.keys(this.variables).map(key => {
        return `${key}: $${key}`;
      });
      queryString += variableUsage.join(', ');
      queryString += ')';
    }
    
    queryString += ' { id name } }';

    // フラグメントがあれば追加
    if (this.fragment) {
      queryString += '\n' + this.fragment;
    }

    return queryString;
  }

  /**
   * 変数の型を推測する（簡易実装）
   * @param value 変数値
   * @returns GraphQL型表現
   * @private
   */
  private getTypeForVariable(value: any): string {
    if (typeof value === 'string') return 'String!';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Int!' : 'Float!';
    }
    if (typeof value === 'boolean') return 'Boolean!';
    if (Array.isArray(value)) return '[ID!]!';
    return 'JSON!'; // 複雑な型の場合はJSONとして扱う
  }

  /**
   * 現在のビルダーをクローンして新しいインスタンスを作成
   * @returns 新しいGraphQLEndpointBuilderインスタンス
   */
  public clone(): GraphQLEndpointBuilder {
    const cloned = new GraphQLEndpointBuilder(this.endpoint);
    cloned.operation = this.operation;
    cloned.operationName = this.operationName;
    cloned.variables = { ...this.variables };
    cloned.fragment = this.fragment;
    cloned.query = this.query;
    cloned.customHeaders = { ...this.customHeaders };
    return cloned;
  }
}

/**
 * GraphQLリクエスト情報インターフェース
 */
export interface GraphQLRequest {
  endpoint: string;
  operationType: GraphQLOperation;
  operationName: string;
  query: string;
  variables: Variables;
  headers: Record<string, string>;
}