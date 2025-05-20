import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * すべてのコンポーネントに共通のベースプロパティ
 */
export interface BaseComponentProps {
  /** コンポーネントのテストID */
  testId?: string;
  /** CSSクラス名 */
  className?: string;
  /** Material UI SXプロパティ */
  sx?: SxProps<Theme>;
}

/**
 * アクセシビリティプロパティ
 */
export interface A11yProps {
  /** ARIA label */
  ariaLabel?: string;
  /** ARIA description */
  ariaDescription?: string;
  /** ARIA role (明示的に指定する場合) */
  role?: string;
}

/**
 * コンテナコンポーネントのプロパティ
 */
export interface ContainerProps extends BaseComponentProps, A11yProps {
  /** コンテナの子要素 */
  children?: ReactNode;
}

/**
 * インタラクティブコンポーネントの状態
 */
export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';

/**
 * インタラクティブコンポーネントのサイズ
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * コンポーネントのバリアント
 */
export type ComponentVariant = 'filled' | 'outlined' | 'text' | 'ghost';

/**
 * カラーパレット
 */
export type ColorPalette = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

/**
 * ボタンのプロパティ
 */
export interface ButtonProps extends BaseComponentProps, A11yProps {
  /** ボタンのラベル */
  label?: string;
  /** クリックハンドラ */
  onClick?: () => void;
  /** ボタンの状態 */
  state?: ComponentState;
  /** ボタンのサイズ */
  size?: ComponentSize;
  /** ボタンのバリアント */
  variant?: ComponentVariant;
  /** ボタンの色 */
  color?: ColorPalette;
  /** 左アイコン */
  startIcon?: ReactNode;
  /** 右アイコン */
  endIcon?: ReactNode;
  /** ボタンの幅を親要素に合わせる */
  fullWidth?: boolean;
  /** ボタンのタイプ */
  type?: 'button' | 'submit' | 'reset';
  /** ボタンの子要素 */
  children?: ReactNode;
}

/**
 * 入力コンポーネントのプロパティ
 */
export interface InputProps extends BaseComponentProps, A11yProps {
  /** 入力値 */
  value: string;
  /** 値変更ハンドラ */
  onChange: (value: string) => void;
  /** 入力ラベル */
  label?: string;
  /** プレースホルダー */
  placeholder?: string;
  /** ヘルプテキスト */
  helperText?: string;
  /** エラーメッセージ */
  error?: string;
  /** 入力タイプ */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  /** 必須フィールドかどうか */
  required?: boolean;
  /** 無効化されているかどうか */
  disabled?: boolean;
  /** コンポーネントのサイズ */
  size?: ComponentSize;
  /** 入力前アイコン */
  startIcon?: ReactNode;
  /** 入力後アイコン */
  endIcon?: ReactNode;
  /** 入力の最大長 */
  maxLength?: number;
  /** オートコンプリート */
  autoComplete?: string;
}

/**
 * カードコンポーネントのプロパティ
 */
export interface CardProps extends ContainerProps {
  /** カードのタイトル */
  title?: string;
  /** カードのサブタイトル */
  subtitle?: string;
  /** アクション要素（ボタンなど） */
  action?: ReactNode;
  /** カードのフッター */
  footer?: ReactNode;
  /** カードのアバター/アイコン */
  avatar?: ReactNode;
  /** カードの高さ */
  height?: number | string;
  /** 最小の高さ */
  minHeight?: number | string;
  /** カードの幅 */
  width?: number | string;
  /** ホバー効果 */
  hoverable?: boolean;
  /** クリック可能か */
  clickable?: boolean;
  /** クリックハンドラ */
  onClick?: () => void;
}

/**
 * バッジコンポーネントのプロパティ
 */
export interface BadgeProps extends BaseComponentProps, A11yProps {
  /** バッジのラベル */
  label: string;
  /** バッジの色 */
  color?: ColorPalette;
  /** バッジのサイズ */
  size?: ComponentSize;
  /** バッジのバリアント */
  variant?: ComponentVariant;
  /** バッジの子要素 */
  children?: ReactNode;
  /** アイコン */
  icon?: ReactNode;
}

/**
 * データ表示プロパティ
 */
export interface DataDisplayProps extends BaseComponentProps, A11yProps {
  /** データのラベル */
  label: string;
  /** データの値 */
  value: string | number;
  /** 変化値 (前期間比など) */
  change?: number;
  /** 変化の表示単位 (%, 円など) */
  unit?: string;
  /** 上昇が良いか（true）悪いか（false） */
  isIncreasePositive?: boolean;
  /** アイコン */
  icon?: ReactNode;
  /** データのフォーマット関数 */
  formatter?: (value: string | number) => string;
}

/**
 * アラート・通知コンポーネントのプロパティ
 */
export interface AlertProps extends BaseComponentProps, A11yProps {
  /** アラートの種類 */
  severity: 'success' | 'info' | 'warning' | 'error';
  /** アラートのタイトル */
  title?: string;
  /** アラートの内容 */
  message: string;
  /** 閉じるボタンを表示するかどうか */
  closable?: boolean;
  /** 閉じるハンドラ */
  onClose?: () => void;
  /** アイコン */
  icon?: ReactNode;
  /** アクション要素 */
  action?: ReactNode;
}

/**
 * モーダル・ダイアログのプロパティ
 */
export interface ModalProps extends BaseComponentProps, A11yProps {
  /** モーダルを表示するかどうか */
  open: boolean;
  /** モーダルを閉じるハンドラ */
  onClose: () => void;
  /** モーダルのタイトル */
  title?: string;
  /** モーダルの内容 */
  children: ReactNode;
  /** フッターのアクション */
  actions?: ReactNode;
  /** 最大幅 */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /** フルスクリーン表示 */
  fullScreen?: boolean;
  /** 背景をクリックして閉じるかどうか */
  closeOnBackdropClick?: boolean;
}

/**
 * 検索バーのプロパティ
 */
export interface SearchBarProps extends BaseComponentProps, A11yProps {
  /** 検索値 */
  value: string;
  /** 値変更ハンドラ */
  onChange: (value: string) => void;
  /** 検索実行ハンドラ */
  onSearch: (value: string) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 検索アイコンの位置 */
  iconPosition?: 'start' | 'end';
  /** カスタム検索アイコン */
  searchIcon?: ReactNode;
  /** クリアボタンを表示するかどうか */
  showClearButton?: boolean;
  /** 検索中かどうか */
  loading?: boolean;
}