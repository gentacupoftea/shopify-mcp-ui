/**
 * ユーティリティ関数のエクスポート
 */
export * from "./validation";
export * from "./export";
export * from "./accessibility";
export * from "./animation";

// 基本フォーマット関数
export {
  formatNumber,
  formatPercent,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  getInitials,
  getPlatformName,
  getStatusLabel
} from "./format";

// 国際化フォーマット関数 (競合するものを明示的に別名でエクスポート)
export {
  formatDate as i18nFormatDate,
  formatTime,
  formatDateTime as i18nFormatDateTime,
  formatNumber as i18nFormatNumber,
  formatCurrency as i18nFormatCurrency,
  formatPercent as i18nFormatPercent,
  formatWithUnit,
  getLanguageName
} from "./i18n-formatter";

// 日付関連ユーティリティ (date.tsから既存の関数のみエクスポート)
export {
  formatRelativeTime as formatTimeDistance
} from "./date";
