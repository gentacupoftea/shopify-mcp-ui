/**
 * RTL (Right-to-Left) サポートユーティリティ
 * RTL Support Utilities
 */

/**
 * RTLの方向に応じたCSSプロパティオブジェクトを取得
 * @param ltrValue - LTR言語での値
 * @param rtlValue - RTL言語での値
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns CSSプロパティオブジェクト
 */
export const getDirectionalProperty = (
  ltrValue: string | number,
  rtlValue: string | number,
  isRTL: boolean = document.dir === 'rtl'
) => {
  return isRTL ? rtlValue : ltrValue;
};

/**
 * RTL対応マージン
 * @param top - 上マージン
 * @param right - 右マージン (LTR) / 左マージン (RTL)
 * @param bottom - 下マージン
 * @param left - 左マージン (LTR) / 右マージン (RTL)
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns マージンプロパティオブジェクト
 */
export const getDirectionalMargin = (
  top: string | number,
  right: string | number,
  bottom: string | number,
  left: string | number,
  isRTL: boolean = document.dir === 'rtl'
) => {
  if (isRTL) {
    return {
      marginTop: top,
      marginRight: left,
      marginBottom: bottom,
      marginLeft: right,
    };
  }
  
  return {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
  };
};

/**
 * RTL対応パディング
 * @param top - 上パディング
 * @param right - 右パディング (LTR) / 左パディング (RTL)
 * @param bottom - 下パディング
 * @param left - 左パディング (LTR) / 右パディング (RTL)
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns パディングプロパティオブジェクト
 */
export const getDirectionalPadding = (
  top: string | number,
  right: string | number,
  bottom: string | number,
  left: string | number,
  isRTL: boolean = document.dir === 'rtl'
) => {
  if (isRTL) {
    return {
      paddingTop: top,
      paddingRight: left,
      paddingBottom: bottom,
      paddingLeft: right,
    };
  }
  
  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
};

/**
 * RTL対応ボーダー
 * @param top - 上ボーダー
 * @param right - 右ボーダー (LTR) / 左ボーダー (RTL)
 * @param bottom - 下ボーダー
 * @param left - 左ボーダー (LTR) / 右ボーダー (RTL)
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns ボーダープロパティオブジェクト
 */
export const getDirectionalBorder = (
  top: string,
  right: string,
  bottom: string,
  left: string,
  isRTL: boolean = document.dir === 'rtl'
) => {
  if (isRTL) {
    return {
      borderTop: top,
      borderRight: left,
      borderBottom: bottom,
      borderLeft: right,
    };
  }
  
  return {
    borderTop: top,
    borderRight: right,
    borderBottom: bottom,
    borderLeft: left,
  };
};

/**
 * RTL対応テキスト配置
 * @param align - LTRでのテキスト配置 ('left', 'right', 'center', 'justify')
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns テキスト配置プロパティオブジェクト
 */
export const getDirectionalTextAlign = (
  align: 'left' | 'right' | 'center' | 'justify',
  isRTL: boolean = document.dir === 'rtl'
) => {
  if ((align === 'left' || align === 'right') && isRTL) {
    return { textAlign: align === 'left' ? 'right' : 'left' };
  }
  
  return { textAlign: align };
};

/**
 * RTL対応float
 * @param float - LTRでのfloat値 ('left', 'right', 'none')
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns floatプロパティオブジェクト
 */
export const getDirectionalFloat = (
  float: 'left' | 'right' | 'none',
  isRTL: boolean = document.dir === 'rtl'
) => {
  if ((float === 'left' || float === 'right') && isRTL) {
    return { float: float === 'left' ? 'right' : 'left' };
  }
  
  return { float };
};

/**
 * MUI用RTLスタイル一式を取得
 * @param isRTL - 現在のレイアウトがRTLかどうか
 * @returns MUI用RTLスタイルオブジェクト
 */
export const getMUIRTLStyles = (isRTL: boolean = document.dir === 'rtl') => {
  if (!isRTL) return {};
  
  // MUI用のRTLスタイル調整
  return {
    // テーブルセル内のテキスト配置
    "& .MuiTableCell-root": {
      textAlign: "right",
    },
    
    // 入力フィールド内のテキスト配置
    "& .MuiInputBase-input": {
      textAlign: "right",
    },
    
    // 入力ラベルの配置
    "& .MuiFormLabel-root": {
      right: 0,
      left: "auto",
      transformOrigin: "right top",
    },
    
    // 入力装飾の配置
    "& .MuiInputAdornment-root": {
      marginLeft: 0,
      marginRight: "8px",
    },
    
    // リストアイコンの配置
    "& .MuiListItemIcon-root": {
      marginRight: 0,
      marginLeft: "16px",
    },
    
    // リストのテキスト配置
    "& .MuiListItemText-root": {
      textAlign: "right",
    },
    
    // ボタンのアイコン配置
    "& .MuiButton-startIcon": {
      marginRight: 0,
      marginLeft: "8px",
    },
    
    "& .MuiButton-endIcon": {
      marginLeft: 0,
      marginRight: "8px",
    },
    
    // ダイアログのボタン配置
    "& .MuiDialogActions-root": {
      justifyContent: "flex-start",
    },
  };
};

/**
 * RTL言語かどうかを判定する
 * @param langCode - 言語コード
 * @returns RTL言語かどうか
 */
export const isRTLLanguage = (langCode: string): boolean => {
  const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];
  return RTL_LANGUAGES.includes(langCode);
};

export default {
  getDirectionalProperty,
  getDirectionalMargin,
  getDirectionalPadding,
  getDirectionalBorder,
  getDirectionalTextAlign,
  getDirectionalFloat,
  getMUIRTLStyles,
  isRTLLanguage,
};