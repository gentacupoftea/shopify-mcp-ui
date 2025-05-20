/**
 * アラートコンポーネント
 * アクセシビリティに準拠したフィードバック表示用コンポーネント
 */
import React, { forwardRef, useState, useEffect } from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  IconButton,
  Collapse,
  Stack,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AlertProps } from '../../../types/component';

// カスタマイズされたアラート
const StyledAlert = styled(MuiAlert, {
  shouldForwardProp: (prop) => !['customSeverity'].includes(prop as string),
})<{ customSeverity: string }>(({ theme, customSeverity }) => {
  // 色とアイコンのマッピング
  const severityMap = {
    success: {
      light: alpha(theme.palette.success.main, 0.12),
      main: theme.palette.success.main,
      dark: theme.palette.success.dark,
      contrastText: theme.palette.success.contrastText,
    },
    info: {
      light: alpha(theme.palette.info.main, 0.12),
      main: theme.palette.info.main,
      dark: theme.palette.info.dark,
      contrastText: theme.palette.info.contrastText,
    },
    warning: {
      light: alpha(theme.palette.warning.main, 0.12),
      main: theme.palette.warning.main,
      dark: theme.palette.warning.dark,
      contrastText: theme.palette.warning.contrastText,
    },
    error: {
      light: alpha(theme.palette.error.main, 0.12),
      main: theme.palette.error.main,
      dark: theme.palette.error.dark,
      contrastText: theme.palette.error.contrastText,
    },
  };

  const colors = severityMap[customSeverity as keyof typeof severityMap] || severityMap.info;

  return {
    backgroundColor: colors.light,
    borderLeft: `4px solid ${colors.main}`,
    color: theme.palette.mode === 'dark' ? colors.contrastText : colors.dark,
    '& .MuiAlertTitle-root': {
      fontWeight: 600,
      color: theme.palette.mode === 'dark' ? colors.contrastText : colors.dark,
    },
    '& .MuiAlert-icon': {
      color: colors.main,
    },
  };
});

/**
 * アラートコンポーネント
 * フィードバックやステータスを表示するためのコンポーネント
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      severity = 'info',
      title,
      message,
      closable = true,
      onClose,
      icon,
      action,
      testId,
      className,
      sx,
      ariaLabel,
      ariaDescription,
      role = 'alert',
    },
    ref
  ) => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    // デフォルトアイコンのマッピング
    const defaultIcons = {
      success: <CheckCircleOutlineIcon />,
      info: <InfoOutlinedIcon />,
      warning: <WarningAmberIcon />,
      error: <ErrorOutlineIcon />,
    };

    // アラートを閉じる処理
    const handleClose = () => {
      setOpen(false);
      if (onClose) {
        onClose();
      }
    };

    // アラートがマウントされたときにスクリーンリーダーに通知
    useEffect(() => {
      if (open) {
        // 必要に応じて、スクリーンリーダー用のアナウンスを追加
      }
    }, [open]);

    return (
      <Collapse in={open}>
        <StyledAlert
          ref={ref}
          severity={severity}
          data-testid={testId}
          className={className}
          sx={sx}
          customSeverity={severity}
          icon={icon || defaultIcons[severity] || defaultIcons.info}
          role={role}
          aria-label={ariaLabel || `${severity}: ${title || ''} ${message}`}
          aria-describedby={ariaDescription ? `${testId}-desc` : undefined}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              {action && <Box>{action}</Box>}
              {closable && (
                <IconButton
                  aria-label="閉じる"
                  color="inherit"
                  size="small"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          }
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
          
          {/* アクセシビリティのための非表示説明 */}
          {ariaDescription && (
            <span id={`${testId}-desc`} style={{ display: 'none' }}>
              {ariaDescription}
            </span>
          )}
        </StyledAlert>
      </Collapse>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;