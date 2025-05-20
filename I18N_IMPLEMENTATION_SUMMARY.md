# 国際化（i18n）実装の概要

## 実装概要

Coneaプロジェクトの国際化（i18n）対応を実装しました。この実装では以下の主要機能を含んでいます：

1. 複数言語のサポート
2. RTL言語への対応
3. 日付、数値、通貨の地域化
4. 言語切替UI
5. パフォーマンス最適化

## 実装されたファイル

### コア設定

- `src/i18n/index.ts` - i18next設定と初期化
- `src/i18n/en.ts` - 英語翻訳
- `src/i18n/ja.ts` - 日本語翻訳
- `src/i18n/fr.ts` - フランス語翻訳（新規追加）
- `src/i18n/ar.ts` - アラビア語翻訳（RTL言語、新規追加）

### コンポーネント

- `src/components/common/LanguageSwitcher.tsx` - 言語切替UIコンポーネント
- `src/layouts/MainLayout.tsx` - RTL対応のレイアウト

### ユーティリティ

- `src/utils/i18n-formatter.ts` - 国際化対応フォーマット関数
- `src/utils/rtl.ts` - RTLスタイルユーティリティ

### テスト

- `src/tests/i18n/i18n.test.ts` - i18n機能のテスト
- `src/tests/components/LanguageSwitcher.test.tsx` - 言語切替コンポーネントのテスト

### ドキュメント

- `docs/i18n-guide.md` - 開発者向けの使用ガイド
- `INTERNATIONALIZATION.md` - プロジェクト全体の国際化実装レポート

## 主な機能

### 1. 多言語サポート

- 現在サポートされている言語: 日本語 (ja)、英語 (en)、フランス語 (fr)、アラビア語 (ar)
- 階層化された翻訳キーとネームスペース
- 複数形と変数のサポート

### 2. RTL言語サポート

- CSSの論理プロパティを活用
- RTL対応UIコンポーネント
- 言語に応じた自動方向性切替

### 3. 日付と数値のフォーマット

- Intl APIを使用した地域化
- 通貨、数値、日付のローカライズ
- 単位変換機能

### 4. 言語切替UI

- 3種類の表示バリエーション（select、menu、button）
- アクセシビリティ対応
- LocalStorageによる設定保存

### 5. パフォーマンス最適化

- 遅延ロードの準備
- コンテキスト分離

## 今後の課題

1. 追加言語のサポート
2. 翻訳キーの統一と整理
3. 自動翻訳APIの統合
4. テスト範囲の拡大
5. 遅延ロードの完全実装

## 使用方法

### 1. 翻訳の使用

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

### 2. 言語切替コンポーネントの使用

```tsx
import { LanguageSwitcher } from '../components/common';

// セレクトフォーム
<LanguageSwitcher variant="select" />

// ドロップダウンメニュー
<LanguageSwitcher variant="menu" />

// ボタングループ
<LanguageSwitcher variant="button" />
```

### 3. フォーマット関数の使用

```tsx
import { i18nFormatDate, i18nFormatCurrency } from '../utils';

// 日付フォーマット
const formattedDate = i18nFormatDate(new Date());

// 通貨フォーマット
const formattedPrice = i18nFormatCurrency(1000, 'JPY');
```

## 詳細情報

より詳細な情報と使用方法については、次のドキュメントを参照してください：

- `docs/i18n-guide.md` - 開発者向けの詳細ガイド
- `INTERNATIONALIZATION.md` - 実装の詳細レポート

## 設定の更新方法

1. 新しい言語を追加する場合：
   - `src/i18n/` に新しい言語ファイル（例: `de.ts`）を作成
   - `src/i18n/index.ts` にリソースとして追加
   - LanguageSwitcherコンポーネントに言語オプションを追加

2. RTL言語を追加する場合：
   - `src/i18n/index.ts` の `RTL_LANGUAGES` 配列に言語コードを追加