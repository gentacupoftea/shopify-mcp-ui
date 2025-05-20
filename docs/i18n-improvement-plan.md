# 国際化（i18n）実装改善計画

このドキュメントは、Shopify-MCP-Server/Coneaプロジェクトの国際化実装に関するコードレビュー結果を踏まえた改善計画を記載しています。v0.3.0リリース後、v0.3.1〜v0.4.0にかけて段階的に実施する予定です。

## 1. 翻訳リソースの遅延ロード完全実装

**優先度:** 中  
**担当者:** フロントエンドチーム  
**期限:** v0.3.1リリース前（〜6/10）

### 課題

現在の実装では、`i18next-http-backend`を含めているものの、実際の遅延ロードが有効化されていません。すべての翻訳リソースが初期バンドルに含まれており、言語が増加するとバンドルサイズが膨らむ問題があります。

### 実装計画

1. **分割戦略の決定**
   - コア翻訳（共通UI要素）と拡張翻訳（ページ固有）の分離
   - 言語ごとのチャンク分割

2. **バックエンド設定の有効化**
   ```typescript
   // src/i18n/index.ts
   i18n
     .use(LanguageDetector)
     .use(Backend) // 遅延ロード用バックエンドを有効化
     .use(initReactI18next)
     .init({
       // 必須翻訳のみをバンドル
       resources: initialResources,
       
       // 遅延ロード設定
       backend: {
         loadPath: '/locales/{{lng}}/{{ns}}.json',
       },
       
       // 言語の一部のみバンドル
       partialBundledLanguages: true,
       ns: ['common', 'core'], // コア名前空間のみ初期ロード
       defaultNS: 'common',
     });
   ```

3. **翻訳ファイルの再構成**
   - `.ts` ファイルから `.json` ファイルへの変換
   - 名前空間による分割（common, auth, dashboard など）

4. **Code Splitting との連携**
   - React.lazy() と組み合わせて、ページごとの翻訳リソースを遅延ロード

5. **パフォーマンス測定**
   - バンドルサイズの変化測定
   - 初期ロード時間とインタラクション時間の比較

## 2. 翻訳キーのバリデーションメカニズム追加

**優先度:** 低（但しCI/CDに組み込む価値あり）  
**担当者:** DevOpsチーム  
**期限:** v0.3.1リリース前（〜6/10）

### 課題

翻訳キーの欠損や不一致を自動的に検出するメカニズムがなく、翻訳漏れが発生するリスクがあります。

### 実装計画

1. **バリデーションスクリプトの作成**
   ```javascript
   // scripts/validate-translations.js
   const fs = require('fs');
   const path = require('path');
   
   const BASE_LANG = 'en'; // 基準言語
   const LANGS = ['en', 'ja', 'fr', 'ar']; // サポート言語
   
   // 翻訳キーを平坦化する関数
   function flattenKeys(obj, prefix = '') {
     return Object.keys(obj).reduce((acc, key) => {
       const newPrefix = prefix ? `${prefix}.${key}` : key;
       if (typeof obj[key] === 'object') {
         Object.assign(acc, flattenKeys(obj[key], newPrefix));
       } else {
         acc[newPrefix] = obj[key];
       }
       return acc;
     }, {});
   }
   
   // 各言語の翻訳キーを取得
   const translations = {};
   LANGS.forEach(lang => {
     const filePath = path.join(__dirname, `../src/i18n/${lang}.ts`);
     // TypeScriptから翻訳オブジェクトを抽出（実際の実装では改良が必要）
     const content = fs.readFileSync(filePath, 'utf-8');
     const exportMatch = content.match(/export default\s+({[\s\S]*?});?\s*$/);
     if (exportMatch) {
       // 危険な評価だが、開発ツールのみで使用
       translations[lang] = eval(`(${exportMatch[1]})`);
     }
   });
   
   // 基準言語の翻訳キーをフラット化
   const baseKeys = Object.keys(flattenKeys(translations[BASE_LANG]));
   
   // 各言語の欠損キーをチェック
   let hasErrors = false;
   LANGS.forEach(lang => {
     if (lang === BASE_LANG) return;
     
     const langKeys = flattenKeys(translations[lang]);
     const missingKeys = baseKeys.filter(key => !langKeys[key]);
     
     if (missingKeys.length > 0) {
       console.error(`[${lang}] Missing translations for:`);
       missingKeys.forEach(key => console.error(`  - ${key}`));
       hasErrors = true;
     }
   });
   
   process.exit(hasErrors ? 1 : 0);
   ```

2. **CI/CD パイプラインへの統合**
   - GitHub Actions ワークフローに組み込み
   - PR 時のバリデーションチェック

3. **エディタ統合**
   - VS Code 拡張機能との連携
   - 翻訳キーの自動補完とリアルタイムバリデーション

4. **不一致レポートの自動生成**
   - 翻訳キー不一致レポートの作成
   - 改善の優先度付け

## 3. RTLレイアウトの視覚的テスト強化

**優先度:** 中  
**担当者:** QAチーム  
**期限:** v0.3.1リリース前（〜6/10）

### 課題

現在のテストはRTL言語の基本機能をカバーしていますが、レイアウトの視覚的テストが不足しています。これによりRTL表示の問題が見逃される可能性があります。

### 実装計画

1. **Storybook との連携**
   - 各コンポーネントのRTLバージョンのストーリー作成
   - RTL/LTRのトグル機能の追加

2. **スナップショットテストの導入**
   ```javascript
   // src/tests/rtl/layout.test.tsx
   import React from 'react';
   import { render } from '@testing-library/react';
   import { Dashboard } from '../../pages/Dashboard/Dashboard';
   import i18n from '../../i18n';
   
   // RTLレイアウトスナップショットテスト
   describe('RTL Layout Tests', () => {
     beforeEach(() => {
       // RTL言語に設定
       i18n.changeLanguage('ar');
       document.documentElement.dir = 'rtl';
     });
     
     afterEach(() => {
       // リセット
       i18n.changeLanguage('en');
       document.documentElement.dir = 'ltr';
     });
   
     test('Dashboard layout renders correctly in RTL', () => {
       const { container } = render(<Dashboard />);
       expect(container).toMatchSnapshot();
     });
     
     // 他の主要コンポーネントについても同様のテスト...
   });
   ```

3. **視覚的回帰テストの導入**
   - Percy または Chromatic との連携
   - 視覚的な違いの自動検出

4. **手動テストガイドの作成**
   - RTLレイアウトの手動テスト手順書
   - よくある問題と解決策のドキュメント化

## 4. その他の改善点

### 4.1 翻訳ファイルのJSONフォーマット化

**優先度:** 低  
**期限:** v0.4.0リリース前

- `.ts` ファイルから `.json` ファイルへの変換
- 外部翻訳ツールとの連携強化

### 4.2 言語切替UIの改善

**優先度:** 低  
**期限:** v0.3.1リリース前

- ハードコーディングされたラベルの翻訳化
- 言語選択の利便性向上

### 4.3 新言語追加プロセスの効率化

**優先度:** 低  
**期限:** v0.4.0リリース前

- 新言語追加スクリプトの作成
- 翻訳ワークフローの最適化

## スケジュール概要

| タスク | 開始 | 完了 | マイルストーン |
|------|------|------|------------|
| 翻訳リソースの遅延ロード | 2025-06-01 | 2025-06-10 | v0.3.1 |
| 翻訳キーのバリデーション | 2025-06-01 | 2025-06-10 | v0.3.1 |
| RTLレイアウトテスト | 2025-06-01 | 2025-06-10 | v0.3.1 |
| 翻訳ファイルのJSON化 | 2025-06-15 | 2025-07-15 | v0.4.0 |
| 言語切替UI改善 | 2025-06-01 | 2025-06-10 | v0.3.1 |
| 新言語追加プロセス改善 | 2025-06-15 | 2025-07-15 | v0.4.0 |

## まとめ

これらの改善を実施することで、Shopify-MCP-Server/Coneaプロジェクトの国際化対応はさらに堅牢になります。v0.3.0リリースでは現状の実装で進め、v0.3.1およびv0.4.0で段階的に改善を行うことで、ユーザー体験を損なうことなく、コードの品質と保守性を向上させることができます。