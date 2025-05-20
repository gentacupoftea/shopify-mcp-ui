/**
 * 空データ状態表示コンポーネント
 * データがない場合の統一表示を提供
 */
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    ariaLabel?: string;
  };
  type?: "default" | "compact" | "fullpage";
  testId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "データがありません",
  description,
  icon,
  action,
  type = "default",
  testId = "empty-state",
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // タイプに応じたサイズ調整
  const sizing = {
    iconSize: type === "compact" ? 32 : type === "fullpage" ? 64 : 48,
    padding: type === "compact" ? 2 : type === "fullpage" ? 6 : 4,
    titleVariant:
      type === "compact" ? "body1" : type === "fullpage" ? "h5" : "h6",
    descriptionVariant: type === "compact" ? "body2" : "body1",
    buttonSize: type === "compact" ? "small" : "medium",
  };

  return (
    <Box
      data-testid={testId}
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: sizing.padding,
        height: type === "compact" ? "auto" : "100%",
        width: "100%",
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.02)",
        borderRadius: 2,
        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      {icon || (
        <DocumentMagnifyingGlassIcon
          style={{
            width: sizing.iconSize,
            height: sizing.iconSize,
            color: theme.palette.mode === "dark" ? "#666" : "#999",
            marginBottom: type === "compact" ? 8 : 16,
          }}
          aria-hidden="true"
        />
      )}

      <Typography
        variant={sizing.titleVariant as any}
        sx={{
          mb: description ? (type === "compact" ? 0.5 : 1) : 0,
          color: theme.palette.text.primary,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant={sizing.descriptionVariant as any}
          sx={{
            mb: action ? (type === "compact" ? 1.5 : 3) : 0,
            color: theme.palette.text.secondary,
            textAlign: "center",
            maxWidth: type === "fullpage" ? "600px" : "none",
          }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant="outlined"
          size={sizing.buttonSize as any}
          onClick={action.onClick}
          aria-label={action.ariaLabel || action.label}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
