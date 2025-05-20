/**
 * API操作の権限設定
 * このファイルでは、APIの読み取り・書き込み権限を集中管理します
 */

/**
 * APIプラットフォーム種別
 */
export type ApiPlatform = 'shopify' | 'rakuten' | 'amazon';

/**
 * プラットフォーム別のセキュリティ設定
 */
export interface PlatformSecurityConfig {
  enableWriteOperations: boolean;
  allowedWriteOperations: string[];
}

/**
 * 本番環境での追加セキュリティ設定
 */
export interface ProductionSecurityConfig {
  requireConfirmationForWrites: boolean;
  loggingEnabled: boolean;
}

/**
 * API全体のセキュリティ設定
 */
export interface ApiSecurityConfig {
  enableWriteOperations: boolean;
  shopify: PlatformSecurityConfig;
  rakuten: PlatformSecurityConfig;
  amazon: PlatformSecurityConfig;
  production: ProductionSecurityConfig;
}

/**
 * APIセキュリティ設定
 * 書き込み操作（POST/PUT/DELETE/PATCH、GraphQLミューテーション）の権限を制御
 */
export const API_SECURITY_CONFIG: ApiSecurityConfig = {
  // 書き込み操作の制御（全体）
  enableWriteOperations: false,  // デフォルトで無効化
  
  // 特定のAPIごとの書き込み操作制御
  shopify: {
    enableWriteOperations: false,
    // 特定の操作のみ許可する場合はここに追加
    allowedWriteOperations: [] as string[],
  },
  rakuten: {
    enableWriteOperations: false,
    allowedWriteOperations: [] as string[],
  },
  amazon: {
    enableWriteOperations: false,
    allowedWriteOperations: [] as string[],
  },
  
  // 本番環境でのさらなる制限
  production: {
    requireConfirmationForWrites: true,  // 書き込み前に確認を要求
    loggingEnabled: true,                // すべてのAPI操作をログに記録
  }
};

/**
 * 特定のプラットフォームとオペレーションに対する書き込み権限チェック
 * @param platform APIプラットフォーム
 * @param operationName 操作名
 * @returns 許可されているかどうか
 */
export function checkWritePermission(platform: ApiPlatform, operationName: string): boolean {
  const platformConfig = API_SECURITY_CONFIG[platform];
  
  // グローバル設定またはプラットフォーム設定で書き込みが無効化されている場合
  if (!API_SECURITY_CONFIG.enableWriteOperations || !platformConfig.enableWriteOperations) {
    // 特定の操作が許可リストに含まれているかチェック
    return platformConfig.allowedWriteOperations.includes(operationName);
  }
  
  // 両方が有効であれば許可
  return true;
}

/**
 * 書き込み操作がブロックされた場合のエラーを作成
 * @param platform APIプラットフォーム
 * @param operationName 操作名
 * @returns エラーオブジェクト
 */
export function createWriteBlockedError(platform: ApiPlatform, operationName: string): Error {
  const message = `Operation "${operationName}" on ${platform} is currently disabled for security reasons.`;
  console.warn(`[Security] ${message}`);
  
  // カスタムエラープロパティを設定
  const error = new Error(message);
  Object.assign(error, {
    code: 'WRITE_OPERATION_BLOCKED',
    platform,
    operation: operationName,
    isSecurityRestriction: true
  });
  
  return error;
}

/**
 * 発生したAPI操作をログに記録
 * @param platform APIプラットフォーム 
 * @param operationType 操作タイプ（GET, POST, PUT, DELETE, QUERY, MUTATION）
 * @param operationName 操作名
 * @param allowed 許可されたかどうか
 */
export function logApiOperation(
  platform: ApiPlatform,
  operationType: string,
  operationName: string,
  allowed: boolean
): void {
  if (API_SECURITY_CONFIG.production.loggingEnabled) {
    const timestamp = new Date().toISOString();
    const status = allowed ? 'ALLOWED' : 'BLOCKED';
    
    console.log(
      `[API-SECURITY] ${timestamp} | ${platform.toUpperCase()} | ${operationType} | ${operationName} | ${status}`
    );
    
    // 実際の環境では適切なロギングサービスに送信
    // TODO: ログサービスへの連携を実装
  }
}