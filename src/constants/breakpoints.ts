/**
 * レスポンシブデザイン用のブレイクポイント定数
 * MUIとTailwind CSSのブレイクポイントを統一
 */

// ブレイクポイント値（px単位）
export const BREAKPOINTS = {
  xs: 0, // スマートフォン (iPhone SE等)
  sm: 600, // 小型タブレット・大型スマートフォン
  md: 960, // タブレット
  lg: 1280, // ノートPC・デスクトップ
  xl: 1920, // 大型ディスプレイ
};

// デバイスの種類に基づくクエリ
export const DEVICE_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.md}px)`,
  largeDesktop: `(min-width: ${BREAKPOINTS.lg}px)`,
};

// 一般的なデバイスのビューポートサイズ
export const DEVICE_SIZES = {
  // スマートフォン
  iphoneSE: { width: 375, height: 667 },
  iphone13: { width: 390, height: 844 },
  iphone13ProMax: { width: 428, height: 926 },
  galaxyS21: { width: 360, height: 800 },

  // タブレット
  ipadMini: { width: 768, height: 1024 },
  ipadPro11: { width: 834, height: 1194 },
  ipadPro12: { width: 1024, height: 1366 },
};

// useMediaQueryのラッパー関数を作成するためのタイプ
export type DeviceType = "mobile" | "tablet" | "desktop" | "largeDesktop";

export default BREAKPOINTS;
