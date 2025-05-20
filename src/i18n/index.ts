/**
 * 多言語対応設定
 * Internationalization Configuration
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// HTTP backend は遅延ロード実装時に必要
// import Backend from "i18next-http-backend";

// RTL言語のリスト
const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

// 基本翻訳リソース (遅延ロードの場合は不要になる - デモのために残す)
import jaTranslations from "./ja";
import enTranslations from "./en";
import frTranslations from "./fr";
import arTranslations from "./ar";

// 初期リソース定義
const resources = {
  ja: {
    translation: jaTranslations,
  },
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

/**
 * HTML要素のdir属性を言語に基づいて設定
 * @param {string} lng 言語コード
 */
export const setDocumentDirection = (lng: string) => {
  if (RTL_LANGUAGES.includes(lng)) {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = lng;
    document.body.setAttribute("data-direction", "rtl");
  } else {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lng;
    document.body.setAttribute("data-direction", "ltr");
  }
};

// デフォルト言語を取得 (localStorage, cookie, ブラウザ設定から)
const getDefaultLanguage = (): string => {
  // ローカルストレージから検索
  const localStorageLng = localStorage.getItem("i18nextLng");
  if (localStorageLng) return localStorageLng;

  // ブラウザの言語設定から取得
  const browserLang = navigator.language.split("-")[0];
  if (Object.keys(resources).includes(browserLang)) return browserLang;

  // 該当なければデフォルト
  return "ja";
};

// 初期言語の設定
const initialLanguage = getDefaultLanguage();

// 方向性を初期設定
setDocumentDirection(initialLanguage);

i18n
  // 言語検出プラグイン
  .use(LanguageDetector)
  // 遅延ロード用バックエンドプラグイン (現在は無効)
  // .use(Backend)
  // React i18next パス
  .use(initReactI18next)
  // 初期化
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    lng: initialLanguage,

    // 遅延ロード設定
    partialBundledLanguages: true,
    
    interpolation: {
      escapeValue: false, // ReactはXSS対策済み
    },

    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },

    react: {
      useSuspense: true, // 言語リソースがロードされるまでSuspenseを使用
    },
  });

// 言語変更時のリスナー
i18n.on("languageChanged", (lng) => {
  setDocumentDirection(lng);
});

// 日付フォーマッタ - 言語に応じたIntl.DateTimeFormatを返す
export const getDateFormatter = (options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat(i18n.language, options);
};

// 数値フォーマッタ - 言語に応じたIntl.NumberFormatを返す
export const getNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(i18n.language, options);
};

// 通貨フォーマッタ - 言語と通貨に応じたIntl.NumberFormatを返す
export const getCurrencyFormatter = (currency: string = "JPY") => {
  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
  });
};

export default i18n;
