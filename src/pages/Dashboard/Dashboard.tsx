/**
 * ダッシュボードページ
 * 各プラットフォームの統合データを表示
 */
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarToday,
  MoreVert,
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setDateRange, setLoading } from "../../store/slices/dashboardSlice";
import { DataTable, SearchBar } from "../../molecules";
import { Button } from "../../atoms";
import { MetricCard } from "../../molecules";
import { Card } from "../../atoms";
import GlassCard from "../../components/futuristic/GlassCard";
import FuturisticButton from "../../components/futuristic/FuturisticButton";
import { Order } from "../../types";
import { SalesChart } from "./components/SalesChart";
import { TopProducts } from "./components/TopProducts";
import { RecentOrders } from "./components/RecentOrders";
import { PlatformSync } from "./components/PlatformSync";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { formatCurrency, formatPercent } from "../../utils/format";

interface DashboardProps {}

// ダッシュボードのメトリクスカードコンポーネントをメモ化
const MemoizedMetricCard = memo(MetricCard);

// レンダリングを最適化するためにカードコンポーネントをメモ化
const MemoizedCard = memo(Card);

export const Dashboard: React.FC<DashboardProps> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const { metrics, chartData, dateRange, loading } = useSelector(
    (state: RootState) => state.dashboard,
  );

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // モックデータを使用（実際はAPIから取得）
  const [mockData] = useState(() => {
    const data = require("../../utils/mockData").default;
    return {
      topProducts: data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        sales: p.sales,
        revenue: p.revenue,
      })),
      recentOrders: data.orders,
      metrics: data.dashboard.metrics,
      chartData: data.dashboard.chartData,
    };
  });

  // ダッシュボードデータの取得
  // データ取得関数をメモ化
  const fetchDashboardData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      // TODO: APIからデータを取得
      // const data = await dashboardService.getData(dateRange);
      // dispatch(setMetrics(data.metrics));
      // dispatch(setChartData(data.charts));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // データ取得エフェクト
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, fetchDashboardData]);
  
  // 日付範囲の変更ハンドラーをメモ化して不要な再作成を防止
  const handleDateRangeChange = useCallback((startDate: Date, endDate: Date) => {
    dispatch(setDateRange({ start: startDate, end: endDate }));
  }, [dispatch]);

  // イベントハンドラーをメモ化
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleExport = useCallback((format: "csv" | "excel" | "pdf") => {
    // TODO: エクスポート処理
    console.log(`Export as ${format}`);
    handleMenuClose();
  }, [handleMenuClose]);

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          {t("dashboard.title")}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <DateRangeSelector
            value={dateRange}
            onChange={handleDateRangeChange}
            startIcon={<CalendarToday />}
          />

          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleExport("csv")}>
              {t("common.export")} (CSV)
            </MenuItem>
            <MenuItem onClick={() => handleExport("excel")}>
              {t("common.export")} (Excel)
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>
              {t("common.export")} (PDF)
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* プラットフォーム同期状態 */}
      <Box sx={{ mb: 3 }}>
        <PlatformSync
          platforms={[
            { platform: "shopify", lastSync: new Date(), status: "synced" },
            { platform: "rakuten", lastSync: new Date(), status: "pending" },
            { platform: "amazon", lastSync: new Date(), status: "error" },
          ]}
          onSync={(platform) => console.log("Sync", platform)}
        />
      </Box>

      {/* メトリクスカード */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <MemoizedMetricCard
              title={t("dashboard.totalSales")}
              value={mockData.metrics.totalSales}
              format="currency"
              currency="JPY"
              trend={{
                value: 12.5,
                direction: "up",
              }}
              info={t("dashboard.salesInfo")}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <MemoizedMetricCard
              title={t("dashboard.totalOrders")}
              value={mockData.metrics.totalOrders}
              format="number"
              trend={{
                value: 8.3,
                direction: "up",
              }}
              info={t("dashboard.ordersInfo")}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <MemoizedMetricCard
              title={t("dashboard.averageOrderValue")}
              value={mockData.metrics.averageOrderValue}
              format="currency"
              currency="JPY"
              trend={{
                value: -2.1,
                direction: "down",
              }}
              info={t("dashboard.aovInfo")}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <MemoizedMetricCard
              title={t("dashboard.conversionRate")}
              value={mockData.metrics.conversionRate}
              format="percent"
              trend={{
                value: 0.5,
                direction: "up",
              }}
              info={t("dashboard.conversionInfo")}
            />
          )}
        </Grid>
      </Grid>

      {/* チャートとテーブル */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <MemoizedCard title={t("dashboard.salesChart")} sx={{ height: "100%" }}>
            {loading ? (
              <Skeleton variant="rectangular" height={400} />
            ) : (
              <SalesChart
                data={mockData.chartData.salesChart}
                title="月次売上推移"
                testId="dashboard-sales-chart"
              />
            )}
          </MemoizedCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <MemoizedCard title={t("dashboard.topProducts")} sx={{ height: "100%" }}>
            {loading ? (
              <Skeleton variant="rectangular" height={400} />
            ) : (
              <TopProducts products={mockData.topProducts} />
            )}
          </MemoizedCard>
        </Grid>

        <Grid item xs={12}>
          <MemoizedCard title={t("dashboard.recentOrders")}>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <RecentOrders orders={mockData.recentOrders} />
            )}
          </MemoizedCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
