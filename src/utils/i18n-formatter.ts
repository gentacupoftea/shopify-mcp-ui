/**
 * 国際化フォーマット関数
 * Internationalization Formatting Utilities
 */
import i18n from "../i18n";

/**
 * 日付フォーマット
 * @param date - フォーマットする日付
 * @param options - Intl.DateTimeFormatのオプション
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "object" ? date : new Date(date);
  const formatter = new Intl.DateTimeFormat(i18n.language, options);
  
  return formatter.format(dateObj);
};

/**
 * 時間フォーマット
 * @param date - フォーマットする日付
 * @param options - Intl.DateTimeFormatのオプション
 * @returns フォーマットされた時間文字列
 */
export const formatTime = (
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  }
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "object" ? date : new Date(date);
  const formatter = new Intl.DateTimeFormat(i18n.language, options);
  
  return formatter.format(dateObj);
};

/**
 * 日時フォーマット
 * @param date - フォーマットする日付
 * @param options - Intl.DateTimeFormatのオプション
 * @returns フォーマットされた日時文字列
 */
export const formatDateTime = (
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "object" ? date : new Date(date);
  const formatter = new Intl.DateTimeFormat(i18n.language, options);
  
  return formatter.format(dateObj);
};

/**
 * 数値フォーマット
 * @param value - フォーマットする数値
 * @param options - Intl.NumberFormatのオプション
 * @returns フォーマットされた数値文字列
 */
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
  }
): string => {
  if (value === null || value === undefined) return "";
  
  const formatter = new Intl.NumberFormat(i18n.language, options);
  
  return formatter.format(value);
};

/**
 * 通貨フォーマット
 * @param value - フォーマットする数値
 * @param currency - 通貨コード (デフォルト: JPY)
 * @param options - 追加のIntl.NumberFormatオプション
 * @returns フォーマットされた通貨文字列
 */
export const formatCurrency = (
  value: number,
  currency: string = "JPY",
  options: Omit<Intl.NumberFormatOptions, "style" | "currency"> = {}
): string => {
  if (value === null || value === undefined) return "";
  
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
    ...options,
  });
  
  return formatter.format(value);
};

/**
 * パーセントフォーマット
 * @param value - フォーマットする数値 (0-1の範囲)
 * @param options - 追加のIntl.NumberFormatオプション
 * @returns フォーマットされたパーセント文字列
 */
export const formatPercent = (
  value: number,
  options: Omit<Intl.NumberFormatOptions, "style"> = {
    maximumFractionDigits: 1,
  }
): string => {
  if (value === null || value === undefined) return "";
  
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: "percent",
    ...options,
  });
  
  return formatter.format(value);
};

/**
 * 単位変換とフォーマット
 * @param value - フォーマットする数値
 * @param unit - 単位 ('metric' | 'imperial')
 * @param type - 値のタイプ ('length' | 'weight' | 'volume')
 * @returns 変換・フォーマットされた文字列
 */
export const formatWithUnit = (
  value: number,
  unit: "metric" | "imperial",
  type: "length" | "weight" | "volume"
): string => {
  if (value === null || value === undefined) return "";
  
  let convertedValue: number;
  let unitSymbol: string;
  
  switch (type) {
    case "length":
      if (unit === "metric") {
        convertedValue = value;
        unitSymbol = "cm";
      } else {
        // Convert cm to inches
        convertedValue = value * 0.393701;
        unitSymbol = "in";
      }
      break;
      
    case "weight":
      if (unit === "metric") {
        convertedValue = value;
        unitSymbol = "kg";
      } else {
        // Convert kg to pounds
        convertedValue = value * 2.20462;
        unitSymbol = "lb";
      }
      break;
      
    case "volume":
      if (unit === "metric") {
        convertedValue = value;
        unitSymbol = "L";
      } else {
        // Convert liters to gallons
        convertedValue = value * 0.264172;
        unitSymbol = "gal";
      }
      break;
      
    default:
      convertedValue = value;
      unitSymbol = "";
  }
  
  return `${formatNumber(convertedValue)} ${unitSymbol}`;
};

/**
 * 言語コードから言語名を取得
 * @param langCode - 言語コード
 * @returns 言語の名称（現在の言語で表示）
 */
export const getLanguageName = (langCode: string): string => {
  try {
    const displayNames = new Intl.DisplayNames([i18n.language], { type: "language" });
    return displayNames.of(langCode) || langCode;
  } catch (error) {
    // DisplayNamesがサポートされていない環境用のフォールバック
    return langCode;
  }
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatWithUnit,
  getLanguageName,
};