/**
 * Amazon SP-API トークン管理クラス
 * LWA (Login with Amazon) OAuth 2.0認証を処理
 */
import axios from 'axios';
import { AmazonAuthConfig, LWATokenResponse } from './types';
import { APIError, ErrorCategory } from '../interfaces/BaseAPIClient';

export class AmazonTokenManager {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  
  // LWA認証エンドポイント
  private static readonly AUTH_ENDPOINT = 'https://api.amazon.com/auth/o2/token';
  
  constructor(config: AmazonAuthConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.refreshToken = config.refreshToken;
  }
  
  /**
   * 有効なアクセストークンを取得
   * トークンが無効または期限切れの場合は自動的に更新
   */
  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken!;
    }
    
    return this.refreshAccessToken();
  }
  
  /**
   * トークンが有効か確認
   * 期限切れの5分前には無効と判断
   */
  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) return false;
    
    // 5分のバッファを持たせる
    const now = new Date();
    return this.tokenExpiry.getTime() - now.getTime() > 5 * 60 * 1000;
  }
  
  /**
   * リフレッシュトークンを使用してアクセストークンを更新
   */
  private async refreshAccessToken(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', this.refreshToken);
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      
      const response = await axios.post<LWATokenResponse>(
        AmazonTokenManager.AUTH_ENDPOINT,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      this.accessToken = response.data.access_token;
      
      // トークンの有効期限を計算（秒からミリ秒に変換）
      const expiresIn = response.data.expires_in * 1000;
      this.tokenExpiry = new Date(Date.now() + expiresIn);
      
      // リフレッシュトークンが含まれていれば更新
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
      }
      
      return this.accessToken;
    } catch (error: any) {
      // エラーを標準化されたAPIErrorに変換
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error_description || 
                          error.response?.data?.error || 
                          'Failed to refresh Amazon access token';
      
      throw new APIError(
        errorMessage,
        statusCode,
        ErrorCategory.AUTHENTICATION,
        statusCode >= 500, // 5xxエラーは再試行可能
        error.response?.data?.error,
        undefined
      );
    }
  }
  
  /**
   * トークンをクリア
   */
  clearTokens(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
  
  /**
   * トークン情報をJSON形式で取得
   */
  getTokenInfo(): Record<string, any> {
    return {
      accessToken: this.accessToken ? '********' : null, // セキュリティのため実際のトークンは表示しない
      tokenExpiry: this.tokenExpiry?.toISOString(),
      isValid: this.isTokenValid(),
      refreshTokenAvailable: !!this.refreshToken
    };
  }
}