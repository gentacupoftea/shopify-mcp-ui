/**
 * バッジコンポーネント
 * ステータス表示やカウンターのための小さなインジケーター
 */
import React, { forwardRef } from 'react';
import {
  Badge as MuiBadge,
  Chip,
  Box,
  SxProps,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BadgeProps } from '../../../types/component';

// 独自のスタイル付きChip
const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => !['statusColor', 'customSize', 'customVariant'].includes(prop as string),
})<{
  statusColor?: string;
  customSize?: string;
  customVariant?: string;
}>(({ theme, statusColor, customSize, customVariant }) => {
  const getBackgroundColor = (color: string) => {
    const colorVal = color === 'primary' ? theme.palette.primary :
                     color === 'secondary' ? theme.palette.secondary :
                     color === 'success' ? theme.palette.success :
                     color === 'warning' ? theme.palette.warning :
                     color === 'error' ? theme.palette.error :
                     color === 'info' ? theme.palette.info :
                     theme.palette.primary;

    if (customVariant === 'filled') {
      return colorVal.main;
    } else if (customVariant === 'outlined') {
      return 'transparent';
    } else if (customVariant === 'ghost') {
      return alpha(colorVal.main, 0.1);
    } else {
      return alpha(colorVal.main, 0.2);
    }
  };

  const getTextColor = (color: string) => {
    const colorVal = color === 'primary' ? theme.palette.primary :
                     color === 'secondary' ? theme.palette.secondary :
                     color === 'success' ? theme.palette.success :
                     color === 'warning' ? theme.palette.warning :
                     color === 'error' ? theme.palette.error :
                     color === 'info' ? theme.palette.info :
                     theme.palette.primary;

    if (customVariant === 'filled') {
      return colorVal.contrastText;
    } else {
      return theme.palette.mode === 'dark' ? colorVal.light : colorVal.dark;
    }
  };

  const getBorderColor = (color: string) => {
    const colorVal = color === 'primary' ? theme.palette.primary :
                     color === 'secondary' ? theme.palette.secondary :
                     color === 'success' ? theme.palette.success :
                     color === 'warning' ? theme.palette.warning :
                     color === 'error' ? theme.palette.error :
                     color === 'info' ? theme.palette.info :
                     theme.palette.primary;

    return customVariant === 'outlined' ? colorVal.main : 'transparent';
  };

  const getSize = (size: string) => {
    switch (size) {
      case 'xs':
        return {
          padding: theme.spacing(0, 0.5),
          fontSize: '0.625rem',
          height: 20,
        };
      case 'sm':
        return {
          padding: theme.spacing(0.25, 0.75),
          fontSize: '0.675rem',
          height: 24,
        };
      case 'md':
        return {
          padding: theme.spacing(0.5, 1),
          fontSize: '0.75rem',
          height: 28,
        };
      case 'lg':
        return {
          padding: theme.spacing(0.5, 1.25),
          fontSize: '0.825rem',
          height: 32,
        };
      case 'xl':
        return {
          padding: theme.spacing(0.75, 1.5),
          fontSize: '0.875rem',
          height: 36,
        };
      default:
        return {
          padding: theme.spacing(0.5, 1),
          fontSize: '0.75rem',
          height: 28,
        };
    }
  };

  return {
    borderRadius: theme.shape.borderRadius * 3,
    fontWeight: 600,
    border: '1px solid',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease-in-out',
    ...getSize(customSize || 'md'),
    
    // 色の設定
    backgroundColor: statusColor ? getBackgroundColor(statusColor) : getBackgroundColor('primary'),
    color: statusColor ? getTextColor(statusColor) : getTextColor('primary'),
    borderColor: statusColor ? getBorderColor(statusColor) : getBorderColor('primary'),
    
    // ホバー効果（必要に応じて）
    '&:hover': {
      backgroundColor: customVariant === 'filled' 
        ? statusColor 
          ? (statusColor === 'primary' ? theme.palette.primary.dark :
             statusColor === 'secondary' ? theme.palette.secondary.dark :
             statusColor === 'success' ? theme.palette.success.dark :
             statusColor === 'warning' ? theme.palette.warning.dark :
             statusColor === 'error' ? theme.palette.error.dark :
             statusColor === 'info' ? theme.palette.info.dark :
             theme.palette.primary.dark)
          : theme.palette.primary.dark 
        : customVariant === 'ghost'
          ? alpha(statusColor 
              ? (statusColor === 'primary' ? theme.palette.primary.main :
                 statusColor === 'secondary' ? theme.palette.secondary.main :
                 statusColor === 'success' ? theme.palette.success.main :
                 statusColor === 'warning' ? theme.palette.warning.main :
                 statusColor === 'error' ? theme.palette.error.main :
                 statusColor === 'info' ? theme.palette.info.main :
                 theme.palette.primary.main)
              : theme.palette.primary.main, 0.2)
          : 'transparent',
    },
    
    // アイコンがある場合のスタイル調整
    '& .MuiChip-icon': {
      color: 'inherit',
      marginRight: theme.spacing(0.5),
      marginLeft: theme.spacing(-0.25),
    },
  };
});

// 数値バッジのスタイル
const getNumericBadgeStyle = (
  theme: any,
  size: string,
  color: string,
  variant: string
): SxProps => {
  const sizeMap = {
    xs: {
      height: 14,
      minWidth: 14,
      fontSize: '0.625rem',
      padding: '0 4px',
    },
    sm: {
      height: 16,
      minWidth: 16,
      fontSize: '0.675rem',
      padding: '0 4px',
    },
    md: {
      height: 20,
      minWidth: 20,
      fontSize: '0.75rem',
      padding: '0 6px',
    },
    lg: {
      height: 24,
      minWidth: 24,
      fontSize: '0.825rem',
      padding: '0 8px',
    },
    xl: {
      height: 28,
      minWidth: 28,
      fontSize: '0.875rem',
      padding: '0 8px',
    },
  };

  const colorVal = color === 'primary' ? theme.palette.primary :
               color === 'secondary' ? theme.palette.secondary :
               color === 'success' ? theme.palette.success :
               color === 'warning' ? theme.palette.warning :
               color === 'error' ? theme.palette.error :
               color === 'info' ? theme.palette.info :
               theme.palette.primary;

  const variantStyles = {
    filled: {
      backgroundColor: colorVal.main,
      color: colorVal.contrastText,
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colorVal.main,
      border: `1px solid ${colorVal.main}`,
    },
    text: {
      backgroundColor: alpha(colorVal.main, 0.1),
      color: theme.palette.mode === 'dark' ? colorVal.light : colorVal.dark,
    },
    ghost: {
      backgroundColor: alpha(colorVal.main, 0.1),
      color: theme.palette.mode === 'dark' ? colorVal.light : colorVal.dark,
    },
  };

  const badgeSize = (size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl') ? 
    sizeMap[size] : sizeMap.md;
    
  const badgeVariant = (variant === 'filled' || variant === 'outlined' || variant === 'text' || variant === 'ghost') ? 
    variantStyles[variant] : variantStyles.filled;
  
  return {
    '& .MuiBadge-badge': {
      ...badgeSize,
      ...badgeVariant,
      borderRadius: '10px',
      fontWeight: 600,
      boxShadow: variant === 'filled' ? theme.shadows[1] : 'none',
    },
  };
};

/**
 * バッジコンポーネント：ステータス表示やカウンターのための小さなインジケーター
 */
interface BadgePropsWithExtensions extends BadgeProps {
  standalone?: boolean; 
  overlap?: 'rectangular' | 'circular';
}

export const Badge = forwardRef<HTMLSpanElement, BadgePropsWithExtensions>(
  (
    {
      label,
      color = 'primary',
      size = 'md',
      variant = 'filled',
      icon,
      children,
      testId,
      className,
      sx,
      ariaLabel,
      standalone = false,
      overlap = 'rectangular',
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    
    // スタンドアロン（Chip）としてレンダリングする場合
    if (standalone) {
      return (
        <StatusChip
          label={label}
          // Remove icon prop as it's causing type issues
          data-testid={testId}
          className={className}
          sx={sx}
          aria-label={ariaLabel || label}
          statusColor={color !== 'default' ? color : 'primary'}
          customSize={size}
          customVariant={variant}
          {...rest}
        />
      );
    }

    // バッジとしてレンダリングする場合（子要素を囲む）
    return (
      <MuiBadge
        ref={ref}
        badgeContent={label}
        color={color !== 'default' ? color : 'primary'}
        data-testid={testId}
        className={className}
        sx={getNumericBadgeStyle(theme, size, color !== 'default' ? color : 'primary', variant)}
        aria-label={ariaLabel || `${children ? 'バッジ: ' : ''}${label}`}
        overlap={overlap}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...rest}
      >
        {children || (
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: 'transparent',
              display: 'inline-block',
            }}
          />
        )}
      </MuiBadge>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;