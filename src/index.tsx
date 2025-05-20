import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n"; // i18n設定をインポート
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// プリロードヒント - 初回ロードで必要になる可能性の高いリソースをプリロード
const preloadResources = () => {
  const chunks = ['Dashboard', 'Login', 'AnalyticsDashboard'];
  chunks.forEach(chunk => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = `/static/js/${chunk.toLowerCase()}.chunk.js`;
    document.head.appendChild(link);
  });
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
  // 本番環境でのみプリロードを実行
  preloadResources();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// 開発環境ではStrictModeを有効に、本番環境では無効化
if (process.env.NODE_ENV === 'development') {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<App />);
}

// Web Vitalsの測定とレポート
reportWebVitals(metric => {
  // 本番環境でのみコンソールに出力
  if (process.env.NODE_ENV === 'production') {
    console.log(metric);
    
    // 必要に応じて Analytics サービスに送信
    // デプロイ後に Google Analytics などと連携する場合は
    // ここに実装を追加
  }
});
