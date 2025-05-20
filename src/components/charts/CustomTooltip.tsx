/**
 * チャート用カスタムツールチップコンポーネント
 * Rechartsのツールチップをカスタマイズし、アクセシビリティを向上
 */
import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { TooltipProps } from "recharts/types/component/Tooltip";
import { formatCurrency, formatDate } from "../../utils/format";

// Rechartsのツールチップpropsから拡張（contentプロパティを除く）
interface CustomTooltipProps extends Omit<TooltipProps<any, any>, "content"> {
  title?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (value: any) => string;
  testId?: string;
  valueType?: "currency" | "percentage" | "number";
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  title,
  prefix = "",
  suffix = "",
  formatter,
  testId = "chart-tooltip",
  valueType = "number",
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 非アクティブ時または表示データがない場合は何も表示しない
  if (!active || !payload || !payload.length) {
    return null;
  }

  // 値のフォーマット処理
  const formatValue = (value: any) => {
    if (formatter) return formatter(value);

    switch (valueType) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return `${value}%`;
      default:
        return String(value);
    }
  };

  return (
    <Paper
      elevation={3}
      data-testid={testId}
      role="tooltip"
      aria-live="polite"
      sx={{
        p: 1.5,
        borderRadius: 1,
        backgroundColor: isDarkMode ? "#333" : "#fff",
        border: `1px solid ${isDarkMode ? "#555" : "#eee"}`,
        maxWidth: 220,
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          color: isDarkMode ? "#fff" : "#000",
          fontWeight: 600,
        }}
      >
        {title || formatDate(label)}
      </Typography>

      {payload.map((entry: any, index: number) => (
        <Box
          key={`tooltip-${index}`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: index < payload.length - 1 ? 0.5 : 0,
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: entry.color || theme.palette.text.secondary,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: entry.color || theme.palette.primary.main,
                display: "inline-block",
                mr: 1,
              }}
              aria-hidden="true"
            />
            {entry.name}:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#fff" : theme.palette.text.primary,
              ml: 1,
            }}
          >
            {prefix}
            {formatValue(entry.value)}
            {suffix}
          </Typography>
        </Box>
      ))}

      {/* スクリーンリーダー用の詳細説明（隠し要素） */}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        }}
      >
        {title || formatDate(label)}のデータ:&nbsp;
        {payload.map(
          (entry: any, index: number) =>
            `${entry.name}: ${prefix}${formatValue(entry.value)}${suffix}${index < payload.length - 1 ? ", " : ""}`,
        )}
      </span>
    </Paper>
  );
};

export default CustomTooltip;
