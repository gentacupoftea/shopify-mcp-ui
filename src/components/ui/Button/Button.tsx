/**
 * ボタンコンポーネント
 * アクセシビリティに準拠したMaterial UIベースのボタン
 */
import React, { forwardRef } from 'react';
import { Button as MuiButton, CircularProgress, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ButtonProps } from '../../../types/component';
import { accessibleFocusStyle } from '../../../utils/accessibility';

// MuiButtonPropsからstartIcon, endIconなどを抽出
type ExtendedMuiButtonProps = Omit<MuiButtonProps, 
  'startIcon' | 'endIcon' | 'variant' | 'color' | 'size' | 'sx' | 'fullWidth'
>;

// MUIのボタンタイプと競合するプロパティを定義
type ButtonConflictProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  role?: string;
};

// 内部使用のボタンプロパティ
interface InternalButtonProps extends Omit<ButtonProps, 'onClick' | 'role'>, Omit<ExtendedMuiButtonProps, 'role'>, ButtonConflictProps {
  rounded?: boolean;
  gradient?: boolean;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => 
    !['rounded', 'gradient', 'customColor', 'customVariant'].includes(prop as string),
})<{
  rounded?: boolean;
  gradient?: boolean;
  customColor?: string;
  customVariant?: string;
}>(({ theme, rounded, gradient, customColor, customVariant }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: rounded ? '50px' : theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',

  // グラデーションスタイル
  ...(gradient && customColor === 'primary' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    boxShadow: '0 3px 5px 2px rgba(16, 185, 129, 0.3)',
  }),

  ...(gradient && customColor === 'secondary' && {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
    boxShadow: '0 3px 5px 2px rgba(59, 130, 246, 0.3)',
  }),

  // ゴーストスタイル
  ...(customVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: customColor === 'primary' ? theme.palette.primary.main :
           customColor === 'secondary' ? theme.palette.secondary.main :
           customColor === 'success' ? theme.palette.success.main :
           customColor === 'warning' ? theme.palette.warning.main :
           customColor === 'error' ? theme.palette.error.main :
           customColor === 'info' ? theme.palette.info.main :
           theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' 
        ? (customColor === 'primary' ? theme.palette.primary.main :
           customColor === 'secondary' ? theme.palette.secondary.main :
           customColor === 'success' ? theme.palette.success.main :
           customColor === 'warning' ? theme.palette.warning.main :
           customColor === 'error' ? theme.palette.error.main :
           customColor === 'info' ? theme.palette.info.main :
           theme.palette.primary.main) + '10'
        : (customColor === 'primary' ? theme.palette.primary.main :
           customColor === 'secondary' ? theme.palette.secondary.main :
           customColor === 'success' ? theme.palette.success.main :
           customColor === 'warning' ? theme.palette.warning.main :
           customColor === 'error' ? theme.palette.error.main :
           customColor === 'info' ? theme.palette.info.main :
           theme.palette.primary.main) + '20',
    },
  }),

  // 状態スタイル
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },

  '&:active': {
    transform: 'translateY(0)',
    boxShadow: theme.shadows[2],
  },

  '&:focus-visible': {
    ...accessibleFocusStyle(theme),
  },

  '&:disabled': {
    transform: 'none',
    boxShadow: 'none',
    opacity: 0.7,
  },

  // リップルエフェクト
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },

  '&:active::after': {
    opacity: 1,
  },
}));

/**
 * アクセシビリティに対応した拡張ボタンコンポーネント
 */
export const Button = forwardRef<HTMLButtonElement, InternalButtonProps>(
  (
    {
      label,
      onClick,
      state = 'default',
      size = 'md',
      variant = 'filled',
      color = 'primary',
      startIcon,
      endIcon,
      fullWidth = false,
      type = 'button',
      testId,
      className,
      sx,
      ariaLabel,
      ariaDescription,
      role,
      rounded = false,
      gradient = false,
      children,
      ...rest
    },
    ref
  ) => {
    // 状態処理
    const isLoading = state === 'loading';
    const isDisabled = state === 'disabled' || isLoading;

    // MUI互換のサイズとバリアントにマッピング
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      xs: 'small',
      sm: 'small',
      md: 'medium',
      lg: 'large',
      xl: 'large',
    };

    const variantMap = {
      filled: 'contained',
      outlined: 'outlined',
      text: 'text',
      ghost: 'text', // ghostはカスタム処理
    };

    const muiSize = sizeMap[size];
    const muiVariant = variantMap[variant] as 'contained' | 'outlined' | 'text';

    return (
      <StyledButton
        ref={ref}
        data-testid={testId}
        variant={muiVariant}
        color={color !== 'default' ? color : undefined}
        size={muiSize}
        disabled={isDisabled}
        startIcon={!isLoading && startIcon}
        endIcon={!isLoading && endIcon}
        fullWidth={fullWidth}
        type={type}
        className={className}
        sx={sx}
        onClick={onClick}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescription ? `${testId}-desc` : undefined}
        role={role}
        rounded={rounded}
        gradient={gradient}
        customColor={color}
        customVariant={variant}
        {...rest}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          children || label
        )}

        {/* アクセシビリティのための非表示説明 */}
        {ariaDescription && (
          <span id={`${testId}-desc`} style={{ display: 'none' }}>
            {ariaDescription}
          </span>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;