/**
 * アニメーションとトランジションのためのユーティリティ
 * アクセシビリティに配慮した動きを定義
 */
import { Theme } from '@mui/material';

/**
 * アニメーション持続時間
 */
export const durations = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  entering: 225,
  leaving: 195,
};

/**
 * イージング関数
 */
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

/**
 * アニメーション設定を生成
 * @param duration 持続時間
 * @param easing イージング関数
 * @param delay 遅延時間
 * @returns アニメーション設定
 */
export const getTransition = (
  duration: number = durations.standard,
  easing: string = easings.easeInOut,
  delay: number = 0
): string => {
  return `${duration}ms ${easing} ${delay}ms`;
};

/**
 * 複数のプロパティに対するトランジション設定を生成
 * @param props トランジションを適用するプロパティ
 * @param options トランジションオプション
 * @returns トランジション設定
 */
export const createTransition = (
  props: string[] = ['all'],
  options: {
    duration?: number;
    easing?: string;
    delay?: number;
  } = {}
): string => {
  const {
    duration = durations.standard,
    easing = easings.easeInOut,
    delay = 0,
  } = options;

  return props
    .map((prop) => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
};

/**
 * アクセシビリティに配慮したアニメーション設定
 * ユーザーがアニメーションを減らす設定を選択している場合に対応
 */
export const getReducedMotion = () => {
  return {
    '@media (prefers-reduced-motion)': {
      animation: 'none !important',
      transition: 'none !important',
    },
  };
};