# 多言語対応 (i18n) ガイド

このドキュメントは、Shopify-MCP-Server/Coneaプロジェクトの国際化 (i18n) 実装について説明します。このプロジェクトでは、複数言語のサポートとRTL（右から左）言語のレイアウト対応を実現しています。

## 目次

1. [概要](#概要)
2. [サポートされている言語](#サポートされている言語)
3. [翻訳リソースの構造](#翻訳リソースの構造)
4. [翻訳の使用方法](#翻訳の使用方法)
5. [RTL言語のサポート](#rtl言語のサポート)
6. [日付と数値のフォーマット](#日付と数値のフォーマット)
7. [言語切替UI](#言語切替ui)
8. [新しい言語の追加方法](#新しい言語の追加方法)
9. [翻訳キーの命名規則](#翻訳キーの命名規則)
10. [テスト](#テスト)
11. [パフォーマンス最適化](#パフォーマンス最適化)
12. [トラブルシューティング](#トラブルシューティング)

## 概要

Coneaプロジェクトでは、`i18next`と`react-i18next`を使用して国際化を実装しています。主な機能は以下の通りです：

- 複数言語のサポート（日本語、英語、フランス語、アラビア語）
- RTL言語への完全対応
- 日付、数値、通貨の地域化
- 言語自動検出と永続化
- 言語リソースの動的ロード

## サポートされている言語

現在、以下の言語をサポートしています：

| 言語コード | 言語名 | RTL | 備考 |
|------------|--------|-----|------|
| `ja` | 日本語 | いいえ | デフォルト言語 |
| `en` | 英語 | いいえ | フォールバック言語 |
| `fr` | フランス語 | いいえ | |
| `ar` | アラビア語 | はい | RTL言語の例 |

## 翻訳リソースの構造

翻訳ファイルは、`src/i18n/`ディレクトリに言語ごとに保存されています：

```
src/i18n/
  ├── index.ts      # i18nextの設定
  ├── en.ts         # 英語の翻訳
  ├── ja.ts         # 日本語の翻訳
  ├── fr.ts         # フランス語の翻訳
  └── ar.ts         # アラビア語の翻訳 (RTL)
```

各言語ファイルは、階層化された翻訳キーを含むオブジェクトをエクスポートします：

```typescript
export default {
  common: {
    save: "Save",
    cancel: "Cancel",
    // ...
  },
  auth: {
    login: "Login",
    logout: "Logout",
    // ...
  },
  // 他のセクション...
}
```

## 翻訳の使用方法

### 基本的な使用法

コンポーネント内で翻訳を使用するには、`useTranslation` フックを使用します：

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### 変数の使用

動的なコンテンツを含む翻訳には、変数を使用できます：

```tsx
// 翻訳キー: dashboard.welcome = "ようこそ、{{name}}さん"
t('dashboard.welcome', { name: user.name })
```

### 複数形

数値に応じた複数形の処理も可能です：

```tsx
// 翻訳キー: 
// items.count_one = "{{count}}個のアイテム"
// items.count_other = "{{count}}個のアイテム"
t('items.count', { count: 1 }) // -> "1個のアイテム"
t('items.count', { count: 5 }) // -> "5個のアイテム"
```

## RTL言語のサポート

RTL（右から左）言語をサポートするために、以下の機能を実装しています：

1. HTML `dir`属性の自動設定：

```typescript
// src/i18n/index.ts
export const setDocumentDirection = (lng: string) => {
  if (RTL_LANGUAGES.includes(lng)) {
    document.documentElement.dir = "rtl";
    // ...
  } else {
    document.documentElement.dir = "ltr";
    // ...
  }
};
```

2. RTL対応のMUIスタイル設定：

```tsx
// RTL言語用のスタイルを動的に適用
const getRTLStyles = (isRTL: boolean) => {
  if (!isRTL) return {};
  
  return {
    "& .MuiInputBase-input": {
      textAlign: "right",
    },
    // 他のRTL用スタイル...
  };
};
```

## 日付と数値のフォーマット

言語に応じた日付と数値のフォーマットには、`Intl` APIを使用しています：

```typescript
// src/utils/i18n-formatter.ts

// 日付フォーマット
export const formatDate = (date: Date, options = {}) => {
  return new Intl.DateTimeFormat(i18n.language, options).format(date);
};

// 通貨フォーマット
export const formatCurrency = (value: number, currency = "JPY") => {
  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
  }).format(value);
};
```

使用例：

```tsx
import { formatDate, formatCurrency } from '../utils/i18n-formatter';

const MyComponent = () => {
  const date = new Date();
  const price = 1000;
  
  return (
    <div>
      <p>日付: {formatDate(date)}</p>
      <p>価格: {formatCurrency(price)}</p>
    </div>
  );
};
```

## 言語切替UI

ユーザーが言語を切り替えるためのUIコンポーネントとして、`LanguageSwitcher`を提供しています：

```tsx
import { LanguageSwitcher } from '../components/common';

// 3種類の表示バリエーション
<LanguageSwitcher variant="select" /> // セレクトフォーム
<LanguageSwitcher variant="menu" />   // ドロップダウンメニュー
<LanguageSwitcher variant="button" /> // ボタングループ
```

## 新しい言語の追加方法

新しい言語を追加するには、以下の手順に従います：

1. 新しい翻訳ファイルを作成します：

```typescript
// src/i18n/de.ts (ドイツ語の例)
export default {
  common: {
    save: "Speichern",
    cancel: "Abbrechen",
    // ...
  },
  // 他のセクション...
};
```

2. `index.ts`ファイルに新しい言語を登録します：

```typescript
// src/i18n/index.ts
import deTranslations from './de';

const resources = {
  // ...
  de: {
    translation: deTranslations,
  },
};
```

3. RTL言語を追加する場合は、RTL言語のリストに追加します：

```typescript
const RTL_LANGUAGES = ["ar", "he", "fa", "ur", /* 新しいRTL言語 */];
```

4. `LanguageSwitcher`コンポーネントに新しい言語オプションを追加します：

```typescript
// src/components/common/LanguageSwitcher.tsx
const SUPPORTED_LANGUAGES = [
  // ...
  {
    code: "de",
    name: "German",
    localName: "Deutsch",
    flag: "🇩🇪",
  },
];
```

## 翻訳キーの命名規則

翻訳キーには階層構造を使用し、以下の命名規則に従います：

1. 最上位キーはセクションやページを表します（例：`common`, `auth`, `dashboard`）
2. セカンドレベルキーは具体的な要素やアクションを表します（例：`common.save`, `auth.login`）
3. 変数を含むキーには、変数を二重中括弧で示します（例：`welcome: "ようこそ、{{name}}さん"`）
4. 関連する項目は同じ階層にグループ化します

```
common.action.save
common.action.cancel
common.action.delete
```

## テスト

多言語対応のテストには、以下のアプローチを使用しています：

1. **単体テスト**：各コンポーネントが正しく翻訳を表示するかをテスト
2. **統合テスト**：言語切替機能の動作テスト
3. **視覚的回帰テスト**：RTLレイアウトの視覚的テスト

テスト例：

```tsx
// コンポーネントの翻訳テスト
it('正しい翻訳を表示すること', async () => {
  // 英語に設定
  await i18n.changeLanguage('en');
  
  render(<MyComponent />);
  expect(screen.getByText('Save')).toBeInTheDocument();
  
  // 日本語に設定
  await i18n.changeLanguage('ja');
  
  render(<MyComponent />);
  expect(screen.getByText('保存')).toBeInTheDocument();
});
```

## パフォーマンス最適化

翻訳リソースのパフォーマンスを最適化するために、以下の方法を実装しています：

1. **遅延ロード**：言語リソースの動的ロード
2. **分割ロード**：コア翻訳と拡張翻訳の分離
3. **キャッシュ**：LocalStorageによる言語設定の永続化

## トラブルシューティング

**問題**: 翻訳キーが表示される（例：`common.save`）
**解決策**: 
- キーのスペルを確認
- 言語リソースが正しくロードされているか確認
- キー階層が正しいか確認

**問題**: RTLレイアウトが崩れる
**解決策**:
- CSS論理プロパティの使用を確認
- コンポーネントがRTL対応しているか確認
- MUIのRTLスタイル設定を確認

**問題**: 言語切替が動作しない
**解決策**:
- LocalStorageのアクセス権を確認
- ブラウザのキャッシュをクリア
- 言語リソースが正しく登録されているか確認

---

このガイドについてご質問や改善提案がある場合は、プロジェクトの開発チームにお問い合わせください。