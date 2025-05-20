/**
 * エラー状態表示コンポーネント
 * アプリケーション全体で統一されたエラー表示を提供
 */
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: "inline" | "fullpage";
  icon?: React.ReactNode;
  testId?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "エラーが発生しました",
  message = "データの読み込み中にエラーが発生しました。後でもう一度お試しください。",
  onRetry,
  type = "inline",
  icon,
  testId = "error-state",
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      data-testid={testId}
      role="alert"
      aria-live="assertive"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: type === "fullpage" ? 8 : 4,
        height: type === "fullpage" ? "100%" : "auto",
        width: "100%",
        backgroundColor: isDarkMode
          ? "rgba(239, 68, 68, 0.1)" // 暗いテーマでの薄い赤
          : "rgba(254, 226, 226, 0.5)", // 明るいテーマでの薄い赤
        borderRadius: 2,
        border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(252, 165, 165, 0.5)"}`,
      }}
    >
      {icon || (
        <ExclamationCircleIcon
          style={{
            width: type === "fullpage" ? 64 : 40,
            height: type === "fullpage" ? 64 : 40,
            color: theme.palette.error.main,
            marginBottom: 16,
          }}
          aria-hidden="true"
        />
      )}

      {title && (
        <Typography
          variant={type === "fullpage" ? "h5" : "h6"}
          color="error"
          sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
        >
          {title}
        </Typography>
      )}

      <Typography
        variant={type === "fullpage" ? "body1" : "body2"}
        sx={{
          mb: onRetry ? 3 : 0,
          textAlign: "center",
          color: theme.palette.text.secondary,
        }}
      >
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          startIcon={<ArrowPathIcon style={{ width: 16, height: 16 }} />}
          aria-label="再試行"
        >
          再試行
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
