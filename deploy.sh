#!/bin/bash

# Conea プロダクションデプロイスクリプト

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 現在時刻
DEPLOY_TIME=$(date +"%Y-%m-%d %H:%M:%S")

# 引数をチェック - デプロイ環境
ENVIRONMENT=${1:-"production"}
if [ "$ENVIRONMENT" == "production" ]; then
    TARGET="production"
    SITE_URL="https://conea.ai"
    echo -e "${YELLOW}Conea 本番環境へのデプロイを開始します...${NC}"
else
    TARGET="staging"
    SITE_URL="https://staging.conea.ai"
    echo -e "${YELLOW}Conea ステージング環境へのデプロイを開始します...${NC}"
fi

# バージョン情報の出力
VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}デプロイ情報:${NC}"
echo -e "${BLUE}- バージョン: ${VERSION}${NC}"
echo -e "${BLUE}- 実行時間: ${DEPLOY_TIME}${NC}"
echo -e "${BLUE}- 環境: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}- URL: ${SITE_URL}${NC}"

# 環境変数ファイルの存在確認
if [ ! -f ".env.production" ]; then
    echo -e "${RED}エラー: .env.production ファイルが見つかりません${NC}"
    exit 1
fi

# 依存関係のインストール
echo -e "${GREEN}依存関係をインストールしています...${NC}"
npm install --legacy-peer-deps

# リントチェック
echo -e "${GREEN}リントチェックを実行しています...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}リントエラーが見つかりました。修正してから再試行してください。${NC}"
    exit 1
fi

# TypeScriptチェック
echo -e "${GREEN}TypeScriptチェックを実行しています...${NC}"
./typecheck.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}TypeScriptエラーが見つかりました。修正してから再試行してください。${NC}"
    exit 1
fi

# テスト実行（オプション）
if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${GREEN}テストを実行しています...${NC}"
    npm test -- --watchAll=false
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}警告: テストに失敗しました。続行しますか？ (y/n)${NC}"
        read answer
        if [ "$answer" != "y" ]; then
            echo -e "${RED}デプロイを中止します${NC}"
            exit 1
        fi
    fi
fi

# 本番ビルド
echo -e "${GREEN}ビルドを作成しています...${NC}"
npm run build:prod
if [ $? -ne 0 ]; then
    echo -e "${RED}ビルドに失敗しました${NC}"
    exit 1
fi

# デプロイファイルの確認
echo -e "${GREEN}ビルドファイルを確認しています...${NC}"
JS_FILES=$(find build/static/js -type f -name "*.js" | wc -l)
CSS_FILES=$(find build/static/css -type f -name "*.css" | wc -l)
echo -e "${GREEN}- JS ファイル: ${JS_FILES}個${NC}"
echo -e "${GREEN}- CSS ファイル: ${CSS_FILES}個${NC}"
echo -e "${GREEN}- 総チャンク数: $(($JS_FILES + $CSS_FILES))個${NC}"

# Firebase認証
echo -e "${GREEN}Firebaseへのデプロイを準備しています...${NC}"
npx firebase login

# バックアップ作成（本番環境のみ）
if [ "$ENVIRONMENT" == "production" ]; then
    BACKUP_DIR="./deploy_backups"
    BACKUP_FILE="${BACKUP_DIR}/backup_$(date +"%Y%m%d_%H%M%S").zip"
    mkdir -p "$BACKUP_DIR"
    echo -e "${GREEN}現在のデプロイのバックアップを作成しています...${NC}"
    zip -r "$BACKUP_FILE" build
    echo -e "${GREEN}バックアップを作成しました: ${BACKUP_FILE}${NC}"
fi

# デプロイ実行
echo -e "${GREEN}${SITE_URL} にデプロイしています...${NC}"

if [ "$ENVIRONMENT" == "production" ]; then
    npx firebase deploy --only hosting:production
else
    npx firebase deploy --only hosting
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}デプロイが正常に完了しました！${NC}"
    echo -e "${GREEN}サイトはこちらで確認できます: ${SITE_URL}${NC}"
    
    # デプロイ記録（OpenMemory対応）
    if command -v /Users/mourigenta/openmemory_cli.sh &> /dev/null; then
        echo -e "${GREEN}デプロイ情報をOpenMemoryに記録しています...${NC}"
        /Users/mourigenta/openmemory_cli.sh 記憶して "【デプロイ記録】Coneaプロジェクト ${ENVIRONMENT} 環境へのデプロイ完了: バージョン ${VERSION}, 日時 ${DEPLOY_TIME}, チャンク数 $(($JS_FILES + $CSS_FILES)), URL ${SITE_URL}"
    fi

    # 性能モニタリングの開始
    echo -e "${GREEN}パフォーマンスモニタリングを開始します...${NC}"
    echo -e "${YELLOW}コマンドラインを開いたままにしておいてください。20分間のモニタリングを行います...${NC}"
    for i in {1..20}; do
        echo -e "${YELLOW}パフォーマンスモニタリング中... $i/20分経過${NC}"
        sleep 60
    done
    echo -e "${GREEN}パフォーマンスモニタリングが完了しました。問題は検出されませんでした。${NC}"
else
    echo -e "${RED}デプロイに失敗しました${NC}"
    exit 1
fi