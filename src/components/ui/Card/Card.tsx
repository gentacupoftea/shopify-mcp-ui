/**
 * カードコンポーネント
 * アクセシビリティに準拠したMaterial UIベースのカード
 */
import React, { forwardRef } from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  CardProps as MuiCardProps,
  useTheme,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CardProps } from '../../../types/component';

// MuiCardPropsから必要なプロパティのみ抽出
type ExtendedMuiCardProps = Omit<MuiCardProps, 'title' | 'variant' | 'sx'>;

// MUIのカードタイプと競合するプロパティを定義
type CardConflictProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  role?: string;
};

// 内部使用のカードプロパティ
interface InternalCardProps extends Omit<CardProps, 'onClick' | 'role'>, Omit<ExtendedMuiCardProps, 'role'>, CardConflictProps {
  shadow?: 'none' | 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'elevated' | 'filled' | 'glass';
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => 
    !['shadow', 'padding', 'hoverable', 'clickable', 'customVariant'].includes(prop as string),
})<{
  shadow?: 'none' | 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  clickable?: boolean;
  customVariant?: string;
}>(({ theme, shadow, padding, hoverable, clickable, customVariant }) => {
  const styles: any = {
    position: 'relative',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: clickable ? 'pointer' : 'default',
    overflow: 'hidden',
  };

  // シャドウスタイル
  if (shadow === 'small') {
    styles.boxShadow = theme.shadows[1];
  } else if (shadow === 'medium') {
    styles.boxShadow = theme.shadows[3];
  } else if (shadow === 'large') {
    styles.boxShadow = theme.shadows[8];
  } else if (shadow === 'none') {
    styles.boxShadow = 'none';
  }

  // パディングスタイル
  if (padding === 'small') {
    styles['& .MuiCardContent-root'] = {
      padding: theme.spacing(1.5),
    };
    styles['& .MuiCardHeader-root'] = {
      padding: theme.spacing(1.5),
    };
    styles['& .MuiCardActions-root'] = {
      padding: theme.spacing(0.75, 1.5),
    };
  } else if (padding === 'large') {
    styles['& .MuiCardContent-root'] = {
      padding: theme.spacing(3),
    };
    styles['& .MuiCardHeader-root'] = {
      padding: theme.spacing(2, 3),
    };
    styles['& .MuiCardActions-root'] = {
      padding: theme.spacing(1.5, 3),
    };
  } else if (padding === 'none') {
    styles['& .MuiCardContent-root'] = {
      padding: 0,
    };
    styles['& .MuiCardHeader-root'] = {
      padding: theme.spacing(1.5, 1.5, 0.5),
    };
    styles['& .MuiCardActions-root'] = {
      padding: theme.spacing(0.5, 1.5, 1.5),
    };
  }

  // ホバー効果
  if (hoverable) {
    styles['&:hover'] = {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
      '&::before': {
        opacity: 0.1,
      }
    };
    
    // ホバー時のオーバーレイ
    styles['&::before'] = {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.primary.main,
      opacity: 0,
      transition: 'opacity 0.2s ease-in-out',
      zIndex: 0,
      pointerEvents: 'none',
    };
  }

  // クリック効果
  if (clickable) {
    styles['&:active'] = {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[3],
    };
  }

  // バリアントスタイル
  if (customVariant === 'filled') {
    styles.backgroundColor = theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff';
  } else if (customVariant === 'glass') {
    styles.backgroundColor = theme.palette.mode === 'dark' 
      ? 'rgba(26, 26, 26, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)';
    styles.backdropFilter = 'blur(10px)';
    styles.borderColor = theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)';
  }

  return styles;
});

/**
 * アクセシビリティに対応した拡張カードコンポーネント
 */
export const Card = forwardRef<HTMLDivElement, InternalCardProps>(
  (
    {
      title,
      subtitle,
      action,
      footer,
      avatar,
      height,
      minHeight,
      width,
      hoverable = false,
      clickable = false,
      onClick,
      children,
      testId,
      className,
      sx,
      ariaLabel,
      ariaDescription,
      role,
      shadow = 'medium',
      padding = 'medium',
      variant = 'outlined',
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    
    // MUIのelevationにマッピング
    const elevationMap = {
      outlined: 0,
      elevated: 3,
      filled: 0,
      glass: 0,
    };
    
    const elevation = elevationMap[variant];
    
    // 追加のスタイル
    const additionalSx = {
      height: height || 'auto',
      minHeight: minHeight || 'auto',
      width: width || 'auto',
      ...(sx || {}),
    };
    
    // クリック可能な場合はrole="button"を追加
    const accessibilityProps = {
      'data-testid': testId,
      'aria-label': ariaLabel || title,
      'aria-describedby': ariaDescription ? `${testId}-desc` : undefined,
      role: role || (clickable ? 'button' : undefined),
      ...(clickable && { tabIndex: 0 }),
    };
    
    // クリック可能な場合はキーボードイベントを追加
    const handleKeyDown = clickable && onClick 
      ? (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }
      : undefined;

    return (
      <StyledCard
        ref={ref}
        className={className}
        sx={additionalSx}
        elevation={elevation}
        variant={variant === 'outlined' ? 'outlined' : undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={handleKeyDown}
        shadow={shadow}
        padding={padding}
        hoverable={hoverable}
        clickable={clickable}
        customVariant={variant}
        {...accessibilityProps}
        {...rest}
      >
        {/* アクセシビリティのための非表示説明 */}
        {ariaDescription && (
          <span id={`${testId}-desc`} style={{ display: 'none' }}>
            {ariaDescription}
          </span>
        )}
        
        {/* カードヘッダー */}
        {(title || subtitle || action || avatar) && (
          <CardHeader
            title={
              title && (
                <Typography variant="h6" component="h3">
                  {title}
                </Typography>
              )
            }
            subheader={
              subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )
            }
            action={action}
            avatar={avatar}
            sx={{ pb: children ? 0 : undefined }}
          />
        )}
        
        {/* カードコンテンツ */}
        {children && <CardContent>{children}</CardContent>}
        
        {/* カードフッター */}
        {footer && (
          <>
            <Divider />
            <CardActions>{footer}</CardActions>
          </>
        )}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

export default Card;