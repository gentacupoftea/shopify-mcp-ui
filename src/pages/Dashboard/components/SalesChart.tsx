import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { formatCurrency, formatDate } from "../../../utils/format";
import { CustomTooltip } from "../../../components/charts";
import { ChartData } from "../../../types";
import {
  accessibleFocusStyle,
  srOnly,
  checkComponentAccessibility,
} from "../../../utils/accessibility";

interface SalesChartProps {
  data:
    | ChartData
    | null
    | Array<{
        date: string;
        amount: number;
      }>;
  title?: string;
  height?: number;
  testId?: string;
  ariaDescription?: string;
  hideTable?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title = "売上推移",
  height,
  testId = "sales-chart",
  ariaDescription,
  hideTable = false,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const chartRef = useRef<HTMLDivElement>(null);

  // データの型を確認して適切な形式に変換
  let rawData: Array<{ date: string; amount: number }> = [];

  if (Array.isArray(data)) {
    rawData = data;
  } else if (data && "labels" in data && "datasets" in data) {
    // ChartData型の場合は変換
    rawData = data.labels.map((label, index) => ({
      date: label,
      amount: data.datasets[0]?.data[index] || 0,
    }));
  }

  // モバイル表示の場合はデータポイントを削減
  const chartData = useMemo(() => {
    if (isMobile && rawData.length > 5) {
      // モバイルの場合は5つのデータポイントに削減
      const step = Math.ceil(rawData.length / 5);
      return rawData.filter((_, index) => index % step === 0);
    }
    if (isTablet && rawData.length > 7) {
      // タブレットの場合は7つのデータポイントに削減
      const step = Math.ceil(rawData.length / 7);
      return rawData.filter((_, index) => index % step === 0);
    }
    return rawData;
  }, [rawData, isMobile, isTablet]);

  // チャートのサイズ調整
  const chartHeight = useMemo(() => {
    if (height) return height;
    if (isMobile) return 250;
    if (isTablet) return 300;
    return 400;
  }, [height, isMobile, isTablet]);

  // チャートデータの合計計算（スクリーンリーダー用）
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.amount, 0);
  }, [chartData]);

  // 選択されたデータポイントのインデックス
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null,
  );

  // フォーカス管理とキーボードナビゲーション
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const chart = chartRef.current;
    chart.tabIndex = 0; // キーボードフォーカスを受け取れるように

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedPointIndex((prev) => {
          const next =
            prev === null ? 0 : Math.min(prev + 1, chartData.length - 1);
          // 選択されたポイントについてスクリーンリーダーに通知
          announceDataPoint(next);
          return next;
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedPointIndex((prev) => {
          const next =
            prev === null ? chartData.length - 1 : Math.max(prev - 1, 0);
          // 選択されたポイントについてスクリーンリーダーに通知
          announceDataPoint(next);
          return next;
        });
      } else if (e.key === "Home") {
        e.preventDefault();
        setSelectedPointIndex(0);
        announceDataPoint(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSelectedPointIndex(chartData.length - 1);
        announceDataPoint(chartData.length - 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPointIndex(null);
      }
    };

    const handleFocus = () => {
      // チャートがフォーカスされたときに最初のポイントを選択
      if (selectedPointIndex === null && chartData.length > 0) {
        setSelectedPointIndex(0);
      }
    };

    const handleBlur = () => {
      // フォーカスが外れたらクリア
      setSelectedPointIndex(null);
    };

    // アクセシビリティチェック（開発環境のみ）
    // チャートがレンダリングされてからチェックを実行
    if (chart) {
      setTimeout(() => checkComponentAccessibility(chart), 100);
    }

    chart.addEventListener("keydown", handleKeyDown);
    chart.addEventListener("focus", handleFocus);
    chart.addEventListener("blur", handleBlur);

    return () => {
      chart.removeEventListener("keydown", handleKeyDown);
      chart.removeEventListener("focus", handleFocus);
      chart.removeEventListener("blur", handleBlur);
    };
  }, [chartData, selectedPointIndex]);

  // スクリーンリーダー用の通知領域
  const announcerRef = useRef<HTMLDivElement>(null);

  // 選択されたデータポイントをスクリーンリーダーに通知
  const announceDataPoint = (index: number) => {
    if (!announcerRef.current || index < 0 || index >= chartData.length) return;

    const item = chartData[index];
    const message = `${formatDate(item.date)}: ${formatCurrency(item.amount)}`;
    announcerRef.current.textContent = message;
  };

  // アクセシビリティ説明テキスト
  const ariaLabel =
    ariaDescription ||
    `${title}チャート: ${chartData.length}件のデータ表示、合計金額${formatCurrency(totalAmount)}`;

  return (
    <div
      ref={chartRef}
      data-testid={testId}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={`${testId}-desc`}
      style={{
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
        padding: isMobile ? "12px" : "16px",
        borderRadius: "8px",
        position: "relative",
        ...(selectedPointIndex !== null
          ? accessibleFocusStyle(theme)
          : { outline: "none" }),
      }}
    >
      <Typography
        variant="h6"
        id={`${testId}-title`}
        sx={{
          mb: 2,
          color: isDarkMode ? "#fff" : "#333",
          fontWeight: 600,
          fontSize: isMobile ? "1rem" : "1.25rem",
        }}
      >
        {title}
      </Typography>

      {/* スクリーンリーダー用説明 */}
      <div id={`${testId}-desc`} style={srOnly as React.CSSProperties}>
        このグラフは{chartData.length}件のデータポイントで構成されています。
        左右の矢印キーでデータポイント間を移動できます。 合計売上は
        {formatCurrency(totalAmount)}です。
      </div>

      {/* スクリーンリーダー用通知領域 (ARIA live region) */}
      <div
        ref={announcerRef}
        aria-live="polite"
        aria-atomic="true"
        style={srOnly as React.CSSProperties}
      ></div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#333" : "#e0e0e0"}
            vertical={!isMobile} // モバイルでは垂直グリッド線を非表示
          />
          <XAxis
            dataKey="date"
            stroke={isDarkMode ? "#888" : "#666"}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickFormatter={(value) => (isMobile ? value.split("-")[2] : value)} // モバイルでは日付を簡略化
            tickMargin={8}
            label={
              isMobile
                ? undefined
                : {
                    value: "日付",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: isDarkMode ? "#888" : "#666" },
                  }
            }
          />
          <YAxis
            stroke={isDarkMode ? "#888" : "#666"}
            tickFormatter={(value) =>
              isMobile ? `${value / 1000}k` : formatCurrency(value)
            } // モバイルでは表示を簡略化
            label={
              isMobile
                ? undefined
                : {
                    value: "売上",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fill: isDarkMode ? "#888" : "#666",
                    },
                  }
            }
          />
          <CustomTooltip
            title={title}
            valueType="currency"
            testId={`${testId}-tooltip`}
          />
          {!isMobile && (
            <Legend wrapperStyle={{ color: isDarkMode ? "#888" : "#666" }} />
          )}
          <Line
            type="monotone"
            dataKey="amount"
            name="売上"
            stroke="#10B981"
            strokeWidth={2}
            dot={!isMobile} // モバイルではドットを非表示
            activeDot={{
              r: selectedPointIndex !== null ? 10 : 8,
              stroke: "#10B981",
              strokeWidth: selectedPointIndex !== null ? 3 : 2,
              fill: theme.palette.background.paper,
              // アクティブドットのスタイル
              ...(selectedPointIndex !== null
                ? {
                    onMouseOver: () => setSelectedPointIndex(null), // ユーザーがマウスで操作を始めたら、キーボードでの選択を解除
                  }
                : {}),
            }}
            // キーボード選択中のデータポイントをハイライト
            {...(selectedPointIndex !== null
              ? {
                  activeIndex: selectedPointIndex,
                  activeShape: (props: any) => {
                    const { cx, cy, stroke, dataKey } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        stroke={stroke}
                        strokeWidth={3}
                        fill={theme.palette.background.paper}
                        style={{
                          filter:
                            "drop-shadow(0px 0px 3px rgba(16, 185, 129, 0.7))",
                        }}
                      />
                    );
                  },
                }
              : {})}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* スクリーンリーダー用の非表示データテーブル */}
      {!hideTable && (
        <div style={srOnly as React.CSSProperties} tabIndex={-1}>
          <table>
            <caption>{title} データ</caption>
            <thead>
              <tr>
                <th scope="col">日付</th>
                <th scope="col">売上</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr
                  key={index}
                  {...(selectedPointIndex === index
                    ? { "aria-current": "true" }
                    : {})}
                >
                  <td>{formatDate(item.date)}</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">合計</th>
                <td>{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* モバイル向けデータサマリー（メディアクエリを使用） */}
      {isMobile && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: isDarkMode ? "#aaa" : "#666",
            fontSize: "0.75rem",
          }}
        >
          合計: {formatCurrency(totalAmount)} | 平均:{" "}
          {formatCurrency(totalAmount / (chartData.length || 1))}
        </Typography>
      )}
    </div>
  );
};
