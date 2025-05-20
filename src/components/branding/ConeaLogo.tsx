/**
 * Coneaロゴコンポーネント
 * アニメーション効果を含む高品質なブランドロゴ
 */
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getReducedMotion } from '../../utils/animation';

interface ConeaLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'responsive';
  showTagline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
  onClick?: () => void;
  testId?: string;
  ariaLabel?: string;
}

// ロゴのコンテナ
const LogoContainer = styled('div')<{
  isClickable: boolean;
  isAnimated: boolean;
}>(({ theme, isClickable, isAnimated }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out',
  cursor: isClickable ? 'pointer' : 'default',
  
  '&:hover': {
    transform: isAnimated && isClickable ? 'scale(1.05)' : 'none',
  },
  
  '&:active': {
    transform: isAnimated && isClickable ? 'scale(0.95)' : 'none',
  },
}));

// アニメーションはCSSトランジションで実装

// SVGパス要素のスタイル
const StyledPath = styled('line')<{ isAnimated: boolean; delay: number }>(
  ({ isAnimated, delay }) => ({
    strokeDasharray: '100',
    strokeDashoffset: isAnimated ? '100' : '0',
    transitionDelay: `${delay}ms`,
    transition: 'stroke-dashoffset 1s ease-in-out',
    ...(isAnimated && { strokeDashoffset: '0' }),
    '@media (prefers-reduced-motion)': {
      transition: 'none',
    },
  })
);

// SVGノード要素のスタイル
const StyledNode = styled('circle')<{ isAnimated: boolean; delay: number }>(
  ({ isAnimated, delay }) => ({
    transition: 'r 2s ease-in-out, opacity 2s ease-in-out',
    transitionDelay: `${delay}ms`,
    r: isAnimated ? '4.5' : '4',
    opacity: isAnimated ? '1' : '0.8',
    '@media (prefers-reduced-motion)': {
      transition: 'none',
      r: '4',
      opacity: '1',
    },
  })
);

// ロゴタイトルのスタイル
const StyledTitle = styled('text')<{ isAnimated: boolean }>(
  ({ isAnimated }) => ({
    opacity: isAnimated ? '0' : '1',
    transform: isAnimated ? 'translateY(5px)' : 'translateY(0)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    transitionDelay: '800ms',
    ...(isAnimated && { 
      opacity: '1',
      transform: 'translateY(0)'
    }),
    '@media (prefers-reduced-motion)': {
      transition: 'none',
      opacity: '1',
      transform: 'translateY(0)',
    },
  })
);

// ロゴタグラインのスタイル
const StyledTagline = styled('text')<{ isAnimated: boolean }>(
  ({ isAnimated }) => ({
    opacity: isAnimated ? '0' : '1',
    transform: isAnimated ? 'translateY(5px)' : 'translateY(0)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    transitionDelay: '1200ms',
    ...(isAnimated && { 
      opacity: '1',
      transform: 'translateY(0)'
    }),
    '@media (prefers-reduced-motion)': {
      transition: 'none',
      opacity: '1',
      transform: 'translateY(0)',
    },
  })
);

/**
 * Coneaブランドロゴコンポーネント
 */
export const ConeaLogo: React.FC<ConeaLogoProps> = ({
  variant = 'horizontal',
  showTagline = false,
  size = 'md',
  className = '',
  animated = false,
  onClick,
  testId = 'conea-logo',
  ariaLabel = 'Coneaロゴ',
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isAnimationActive, setIsAnimationActive] = useState(animated);

  // モバイル対応のサイズ調整
  const isResponsive = variant === 'responsive';
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false; // 768px以下をモバイルとする
  const actualVariant = isResponsive
    ? isMobile ? 'icon-only' : 'horizontal'
    : variant;

  // サイズマッピング
  const sizes = {
    xs: { width: 80, height: 30 },
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 50 },
    lg: { width: 220, height: 60 },
    xl: { width: 280, height: 80 },
  };

  // カラー設定
  const colors = {
    icon: theme.palette.primary.main,
    text: isDarkMode ? '#FFFFFF' : '#1F2937',
    tagline: isDarkMode ? '#D1D5DB' : '#6B7280',
  };

  const { width, height } = sizes[size];

  // アニメーションリセット
  useEffect(() => {
    if (animated) {
      setIsAnimationActive(true);
      const timer = setTimeout(() => {
        setIsAnimationActive(false);
      }, 2500); // アニメーション完了後にリセット

      return () => clearTimeout(timer);
    }
  }, [animated]);

  // アイコンのみの場合
  if (actualVariant === 'icon-only') {
    return (
      <LogoContainer
        isClickable={!!onClick}
        isAnimated={isAnimationActive}
        onClick={onClick}
        data-testid={testId}
        className={className}
        role={onClick ? 'button' : 'img'}
        aria-label={ariaLabel}
        tabIndex={onClick ? 0 : undefined}
      >
        <svg
          width={size === 'xs' ? 32 : size === 'sm' ? 40 : size === 'md' ? 48 : size === 'lg' ? 56 : 64}
          height={size === 'xs' ? 32 : size === 'sm' ? 40 : size === 'md' ? 48 : size === 'lg' ? 56 : 64}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <StyledNode
            cx="12"
            cy="12"
            r="4.5"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={0}
          />
          <StyledNode
            cx="36"
            cy="12"
            r="4.5"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={200}
          />
          <StyledNode
            cx="24"
            cy="36"
            r="4.5"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={400}
          />
          <StyledPath
            x1="12"
            y1="12"
            x2="24"
            y2="36"
            stroke={colors.icon}
            strokeWidth="3"
            isAnimated={isAnimationActive}
            delay={600}
          />
          <StyledPath
            x1="36"
            y1="12"
            x2="24"
            y2="36"
            stroke={colors.icon}
            strokeWidth="3"
            isAnimated={isAnimationActive}
            delay={700}
          />
          <StyledPath
            x1="12"
            y1="12"
            x2="36"
            y2="12"
            stroke={colors.icon}
            strokeWidth="3"
            isAnimated={isAnimationActive}
            delay={500}
          />
        </svg>
      </LogoContainer>
    );
  }

  // 完全なロゴ（水平または垂直）
  return (
    <LogoContainer
      isClickable={!!onClick}
      isAnimated={isAnimationActive}
      onClick={onClick}
      data-testid={testId}
      className={className}
      role={onClick ? 'button' : 'img'}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* アイコン部分 */}
        <g id="icon" transform="translate(5, 5)">
          <StyledNode
            cx="8"
            cy="8"
            r="4"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={0}
          />
          <StyledNode
            cx="28"
            cy="8"
            r="4"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={200}
          />
          <StyledNode
            cx="18"
            cy="28"
            r="4"
            fill={colors.icon}
            isAnimated={isAnimationActive}
            delay={400}
          />
          <StyledPath
            x1="8"
            y1="8"
            x2="18"
            y2="28"
            stroke={colors.icon}
            strokeWidth="2.5"
            isAnimated={isAnimationActive}
            delay={600}
          />
          <StyledPath
            x1="28"
            y1="8"
            x2="18"
            y2="28"
            stroke={colors.icon}
            strokeWidth="2.5"
            isAnimated={isAnimationActive}
            delay={700}
          />
          <StyledPath
            x1="8"
            y1="8"
            x2="28"
            y2="8"
            stroke={colors.icon}
            strokeWidth="2.5"
            isAnimated={isAnimationActive}
            delay={500}
          />
        </g>

        {/* テキスト部分 */}
        <StyledTitle
          x={actualVariant === 'vertical' ? 18 : 46}
          y={actualVariant === 'vertical' ? 45 : 23}
          fontFamily="Inter, -apple-system, sans-serif"
          fontSize={size === 'xs' ? 14 : size === 'sm' ? 18 : size === 'md' ? 24 : size === 'lg' ? 28 : 32}
          fontWeight="700"
          fill={colors.text}
          alignmentBaseline="middle"
          isAnimated={isAnimationActive}
        >
          conea
        </StyledTitle>

        {/* タグライン（オプション） */}
        {showTagline && (
          <StyledTagline
            x={actualVariant === 'vertical' ? 18 : 46}
            y={actualVariant === 'vertical' ? 55 : 37}
            fontFamily="Inter, -apple-system, sans-serif"
            fontSize={size === 'xs' ? 8 : size === 'sm' ? 9 : size === 'md' ? 10 : size === 'lg' ? 12 : 14}
            fill={colors.tagline}
            alignmentBaseline="middle"
            isAnimated={isAnimationActive}
          >
            AI Driven Analytics
          </StyledTagline>
        )}
      </svg>
    </LogoContainer>
  );
};

export default ConeaLogo;