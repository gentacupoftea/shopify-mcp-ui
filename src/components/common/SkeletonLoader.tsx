/**
 * スケルトンローディングコンポーネント
 * 様々なコンテンツタイプに対応したローディング表示
 */
import React from "react";
import { Skeleton, Box, useTheme, useMediaQuery, Grid } from "@mui/material";

export type SkeletonType =
  | "chart"
  | "table"
  | "card"
  | "text"
  | "list"
  | "metrics";

interface SkeletonLoaderProps {
  type: SkeletonType;
  rows?: number;
  height?: number | string;
  width?: number | string;
  animated?: boolean;
  borderRadius?: number;
  testId?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type,
  rows = 1,
  height,
  width = "100%",
  animated = true,
  borderRadius = 1,
  testId = "skeleton-loader",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // スケルトンの背景色（テーマに応じて調整）
  const skeletonColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.06)";

  // タイプに応じた高さのデフォルト値を設定
  const getDefaultHeight = () => {
    switch (type) {
      case "chart":
        return isMobile ? 250 : 400;
      case "card":
        return isMobile ? 120 : 140;
      case "table":
        return 52 * (rows + 1); // 見出し + 行数分の高さ
      case "text":
        return 24 * rows;
      case "list":
        return 60 * rows;
      case "metrics":
        return isMobile ? 100 : 120;
      default:
        return 100;
    }
  };

  // アニメーション設定
  const animation = animated ? "wave" : false;

  // アクセシビリティ用の隠しテキスト（スクリーンリーダー用）
  const getAriaLabel = () => {
    switch (type) {
      case "chart":
        return "チャートデータを読み込み中";
      case "table":
        return "テーブルデータを読み込み中";
      case "card":
        return "カードコンテンツを読み込み中";
      case "text":
        return "テキストコンテンツを読み込み中";
      case "list":
        return "リストデータを読み込み中";
      case "metrics":
        return "メトリクスデータを読み込み中";
      default:
        return "コンテンツを読み込み中";
    }
  };

  // スケルトンタイプに応じたレンダリング
  const renderSkeleton = () => {
    const finalHeight = height || getDefaultHeight();

    switch (type) {
      case "chart":
        return (
          <Box sx={{ width, height: finalHeight }}>
            <Skeleton
              variant="rectangular"
              height={finalHeight}
              width={width}
              animation={animation}
              sx={{ borderRadius }}
            />
          </Box>
        );

      case "table":
        return (
          <Box sx={{ width }}>
            <Skeleton
              variant="rectangular"
              height={56}
              width={width}
              animation={animation}
              sx={{ mb: 1, borderRadius }}
            />
            {Array(rows)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={52}
                  width={width}
                  animation={animation}
                  sx={{ mb: 0.5, borderRadius }}
                />
              ))}
          </Box>
        );

      case "card":
        return (
          <Box sx={{ width, height: finalHeight }}>
            <Skeleton
              variant="rectangular"
              height={finalHeight}
              width={width}
              animation={animation}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        );

      case "text":
        return (
          <Box sx={{ width }}>
            {Array(rows)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  height={24}
                  width={i === 0 ? "100%" : `${85 - i * 10}%`}
                  animation={animation}
                  sx={{ borderRadius }}
                />
              ))}
          </Box>
        );

      case "list":
        return (
          <Box sx={{ width }}>
            {Array(rows)
              .fill(0)
              .map((_, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", mb: 1, alignItems: "center" }}
                >
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation={animation}
                    sx={{ mr: 1 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={24}
                      animation={animation}
                      sx={{ borderRadius }}
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      animation={animation}
                      sx={{ borderRadius }}
                    />
                  </Box>
                </Box>
              ))}
          </Box>
        );

      case "metrics":
        return (
          <Grid container spacing={2}>
            {Array(rows)
              .fill(0)
              .map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={24}
                      animation={animation}
                      sx={{ mb: 1, borderRadius }}
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={32}
                      animation={animation}
                      sx={{ mb: 0.5, borderRadius }}
                    />
                    <Skeleton
                      variant="text"
                      width="30%"
                      height={20}
                      animation={animation}
                      sx={{ borderRadius }}
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>
        );

      default:
        return (
          <Skeleton
            variant="rectangular"
            height={finalHeight}
            width={width}
            animation={animation}
            sx={{ borderRadius }}
          />
        );
    }
  };

  return (
    <Box
      data-testid={testId}
      role="status"
      aria-busy="true"
      aria-label={getAriaLabel()}
      sx={{
        backgroundColor: "transparent",
        "& .MuiSkeleton-root": {
          bgcolor: skeletonColor,
        },
      }}
    >
      {renderSkeleton()}
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
        {getAriaLabel()}
      </span>
    </Box>
  );
};

export default SkeletonLoader;
