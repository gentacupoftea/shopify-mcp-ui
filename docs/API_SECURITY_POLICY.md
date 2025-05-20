# API セキュリティポリシー

## 書き込み操作の制限について

現在のバージョンでは、セキュリティ上の理由から商品情報や在庫などの書き込み操作（POST/PUT/DELETE/PATCH、GraphQLミューテーション）はデフォルトで**無効化**されています。

### 理由

1. **AI安全性の確保**: AIが誤って重要なデータを変更してしまうリスクを根本的に排除
2. **最小権限の原則**: 現段階で必要のない機能を制限することでセキュリティを向上
3. **データ保護**: 顧客の実データに対する意図しない変更を防止

### 書き込み操作の有効化方法

将来的に書き込み機能が必要になった場合は、以下の手順で有効化できます：

1. セキュリティレビューの実施
2. 適切な認可メカニズムの実装
3. `src/config/api-security.ts` の設定を更新
4. テスト環境での検証
5. 段階的な本番環境への展開

```typescript
// 書き込み操作を有効化する例
export const API_SECURITY_CONFIG = {
  enableWriteOperations: true,  // グローバルに有効化
  
  shopify: {
    enableWriteOperations: true,  // Shopify APIへの書き込みを有効化
    allowedWriteOperations: [
      'updateProduct',
      'updateInventory'
    ],  // 特定の操作のみ許可
  },
  // ...
};
```

### 書き込み操作エラーメッセージ

書き込み操作が無効化されている際に書き込みを試みると、以下のようなエラーメッセージが表示されます：

```json
{
  "success": false,
  "error": {
    "code": "WRITE_OPERATION_BLOCKED",
    "message": "Operation \"updateProduct\" on shopify is currently disabled for security reasons.",
    "details": {
      "platform": "shopify",
      "operation": "updateProduct"
    }
  }
}
```

### 特定の操作のみ許可する方法

セキュリティとユーザビリティのバランスが必要な場合は、`allowedWriteOperations` 配列に特定の操作名を追加することで、グローバルに書き込みを無効化しながらも特定の操作のみを許可することができます：

```typescript
export const API_SECURITY_CONFIG = {
  enableWriteOperations: false,  // グローバルには無効化
  
  shopify: {
    enableWriteOperations: false,  // プラットフォームレベルでも無効化
    allowedWriteOperations: [
      'syncProducts',  // 同期機能のみ許可
      'syncOrders'
    ],
  },
  // ...
};
```

### ログ記録

すべてのAPI操作（特に書き込み操作の試行）は自動的にログに記録され、セキュリティ監査の目的で保持されます。ログには以下の情報が含まれます：

- タイムスタンプ
- プラットフォーム（Shopify, Rakuten, Amazon）
- 操作タイプ（GET, POST, PUT, DELETE, QUERY, MUTATION）
- 操作名
- 処理結果（ALLOWED / BLOCKED）

例：
```
[API-SECURITY] 2025-05-20T10:15:30.123Z | SHOPIFY | POST | updateProduct | BLOCKED
```

## ベストプラクティス

1. 読み取り専用操作をメイン機能として設計する
2. 必要に応じて特定の書き込み操作のみを許可する
3. すべての書き込み操作前に確認プロンプトを表示する
4. 定期的にセキュリティ設定を見直す

## 今後の拡張

1. 操作ごとの詳細な権限設定
2. ユーザーロールベースのアクセス制御
3. 監査ログの可視化ダッシュボード
4. AI安全性チェック機構の追加

---

作成: 2025年5月20日  
最終更新: 2025年5月20日