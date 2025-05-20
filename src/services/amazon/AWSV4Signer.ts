/**
 * AWS Signature Version 4 (SigV4) 署名実装
 * Amazon SP-APIリクエストに必要なAWS認証を提供
 */
import crypto from 'crypto';
import { AWSCredentials } from './types';
import { AxiosRequestConfig } from 'axios';

export class AWSV4Signer {
  private accessKey: string;
  private secretKey: string;
  private region: string;
  private service: string;
  
  constructor(credentials: AWSCredentials, service: string = 'execute-api') {
    this.accessKey = credentials.accessKey;
    this.secretKey = credentials.secretKey;
    this.region = credentials.region;
    this.service = service;
  }
  
  /**
   * リクエストにAWS SigV4署名を追加
   * @param request Axiosリクエスト設定
   * @returns 署名付きリクエスト設定
   */
  signRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    if (!request.headers) {
      request.headers = {};
    }
    
    // リクエストメソッドを確保
    const method = request.method?.toUpperCase() || 'GET';
    
    // URLから必要な情報を抽出
    const urlObj = new URL(request.url || '');
    const pathname = urlObj.pathname;
    const host = urlObj.host;
    const queryString = urlObj.search.substring(1);
    
    // 現在の日時を取得（ISO 8601形式）
    const now = new Date();
    const amzDate = this.toAmzDate(now);
    const dateStamp = this.toDateStamp(now);
    
    // リクエストヘッダーに日時とホストを追加
    request.headers['x-amz-date'] = amzDate;
    request.headers['host'] = host;
    
    // CanonicalRequestの作成
    const canonicalUri = pathname;
    const canonicalQueryString = this.getCanonicalQueryString(queryString);
    const payloadHash = this.hashPayload(request.data);
    
    // 署名に含めるヘッダーとその値を整形
    const canonicalHeaders = this.getCanonicalHeaders(request.headers);
    // 署名に含めるヘッダー名のリスト
    const signedHeaders = this.getSignedHeaders(request.headers);
    
    // 正規リクエスト文字列の構築
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      '',  // 改行
      signedHeaders,
      payloadHash
    ].join('\n');
    
    // 署名文字列の作成
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      this.hash(canonicalRequest)
    ].join('\n');
    
    // 署名キーの導出
    const signingKey = this.getSignatureKey(
      this.secretKey,
      dateStamp,
      this.region,
      this.service
    );
    
    // 署名の計算
    const signature = this.hmac(signingKey, stringToSign).toString('hex');
    
    // Authorizationヘッダーの構築
    const authorizationHeader = [
      `${algorithm} Credential=${this.accessKey}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');
    
    // リクエストにAuthorizationヘッダーを追加
    request.headers['Authorization'] = authorizationHeader;
    
    // ペイロードハッシュをヘッダーに追加（ストリーミングリクエスト用）
    request.headers['x-amz-content-sha256'] = payloadHash;
    
    return request;
  }
  
  /**
   * 日付をAWS形式（YYYYMMDD'T'HHMMSS'Z'）に変換
   */
  private toAmzDate(date: Date): string {
    return date.toISOString()
      .replace(/[-:]/g, '')  // ハイフンとコロンを削除
      .replace(/\.\d+/g, ''); // ミリ秒を削除
  }
  
  /**
   * 日付をAWS形式の日付のみ（YYYYMMDD）に変換
   */
  private toDateStamp(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }
  
  /**
   * 正規クエリ文字列を作成
   */
  private getCanonicalQueryString(queryString: string): string {
    if (!queryString) return '';
    
    // クエリパラメータをキー/値のペアに分解
    const queryParams = new URLSearchParams(queryString);
    const sortedParams: string[] = [];
    
    // パラメータをキーでソート
    for (const [key, value] of Array.from(queryParams.entries()).sort()) {
      // キーと値をURIエンコード
      const encodedKey = this.uriEncode(key);
      const encodedValue = this.uriEncode(value);
      sortedParams.push(`${encodedKey}=${encodedValue}`);
    }
    
    return sortedParams.join('&');
  }
  
  /**
   * 正規ヘッダー文字列を作成
   */
  private getCanonicalHeaders(headers: Record<string, string>): string {
    const canonicalHeaders: string[] = [];
    
    // ヘッダーをキーでソート
    const sortedHeaders = Object.keys(headers).sort();
    
    for (const key of sortedHeaders) {
      // ヘッダー名を小文字に変換
      const lowerKey = key.toLowerCase();
      // 値の前後の空白を削除
      const value = headers[key].trim();
      canonicalHeaders.push(`${lowerKey}:${value}`);
    }
    
    return canonicalHeaders.join('\n') + '\n';
  }
  
  /**
   * 署名に含めるヘッダー名のリストを作成
   */
  private getSignedHeaders(headers: Record<string, string>): string {
    // ヘッダー名をソート
    return Object.keys(headers)
      .map(key => key.toLowerCase())
      .sort()
      .join(';');
  }
  
  /**
   * ペイロードのSHA256ハッシュを計算
   */
  private hashPayload(payload: any): string {
    if (!payload) return this.hash('');
    
    // オブジェクトの場合はJSON文字列に変換
    const body = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    return this.hash(body);
  }
  
  /**
   * 文字列のSHA256ハッシュを計算
   */
  private hash(data: string): string {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
  }
  
  /**
   * HMAC-SHA256を計算
   */
  private hmac(key: Buffer | string, data: string): Buffer {
    return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
  }
  
  /**
   * AWS SigV4署名キーを生成
   */
  private getSignatureKey(
    key: string,
    dateStamp: string,
    regionName: string,
    serviceName: string
  ): Buffer {
    const kDate = this.hmac(`AWS4${key}`, dateStamp);
    const kRegion = this.hmac(kDate, regionName);
    const kService = this.hmac(kRegion, serviceName);
    const kSigning = this.hmac(kService, 'aws4_request');
    return kSigning;
  }
  
  /**
   * URI部分エンコード（AWS SigV4仕様に準拠）
   * RFC 3986に従い、以下の文字のみエンコードしない:
   * A-Z, a-z, 0-9, ハイフン(-), アンダースコア(_), ドット(.), チルダ(~)
   */
  private uriEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
      .replace(/%7E/g, '~');
  }
}