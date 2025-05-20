/**
 * アクセシビリティに対応した棒グラフコンポーネント
 * SalesChartと同様のアクセシビリティパターンを適用
 */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { formatCurrency, formatNumber } from '../../utils/format';
import { CustomTooltip } from './CustomTooltip';
import { checkComponentAccessibility } from '../../utils/accessibility';
import {
  A11yChartProps,
  getChartA11yProps,
  setupChartKeyboardNavigation
} from '../../utils/a11yChartPatterns';

interface BarChartProps extends A11yChartProps {
  data: Array<Record<string, any>>;
  xAxisKey: string;
  yAxisKey: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  barColor?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  title,
  yAxisLabel,
  xAxisLabel,
  barColor = '#3B82F6', // デフォルト色
  height,
  testId = 'bar-chart',
  ariaLabel,
  ariaDescription,
  hideTable = false,
  valueFormatter = formatNumber
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // 参照とフォーカス状態
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  
  // チャートデータ最適化 (モバイル/タブレット)
  const chartData = useMemo(() => {
    if (isMobile && data.length > 5) {
      const step = Math.ceil(data.length / 5);
      return data.filter((_, index) => index % step === 0);
    }
    if (isTablet && data.length > 7) {
      const step = Math.ceil(data.length / 7);
      return data.filter((_, index) => index % step === 0);
    }
    return data;
  }, [data, isMobile, isTablet]);
  
  // チャートの高さ
  const chartHeight = useMemo(() => {
    if (height) return height;
    if (isMobile) return 250;
    if (isTablet) return 300;
    return 400;
  }, [height, isMobile, isTablet]);
  
  // データの合計と平均（スクリーンリーダー用）
  const dataStats = useMemo(() => {
    const sum = chartData.reduce((acc, item) => acc + Number(item[yAxisKey]), 0);
    const avg = sum / (chartData.length || 1);
    return { sum, avg };
  }, [chartData, yAxisKey]);
  
  // 選択されたデータポイントをスクリーンリーダーに通知
  const announceDataPoint = (index: number) => {
    if (!announcerRef.current || index < 0 || index >= chartData.length) return;
    
    const item = chartData[index];
    const message = `${item[xAxisKey]}: ${valueFormatter(item[yAxisKey])}`;
    announcerRef.current.textContent = message;
  };
  
  // キーボードナビゲーション設定
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;
    
    const cleanup = setupChartKeyboardNavigation(
      chartRef,
      {
        selectedIndex,
        setSelectedIndex,
        dataLength: chartData.length
      },
      announceDataPoint
    );
    
    // アクセシビリティチェック（開発環境のみ）
    // チャートがレンダリングされてからチェックを実行
    if (chartRef.current) {
      checkComponentAccessibility(chartRef.current);
    }
    
    return cleanup;
  }, [chartData, selectedIndex]);
  
  // スクリーンリーダー用テーブルの列定義
  const tableColumns = [
    { key: xAxisKey, label: xAxisLabel || xAxisKey },
    { key: yAxisKey, label: yAxisLabel || yAxisKey }
  ];
  
  // スクリーンリーダー用サマリーデータ
  const summaryData = [
    { label: '合計', value: valueFormatter(dataStats.sum) },
    { label: '平均', value: valueFormatter(dataStats.avg) }
  ];
  
  return (
    <div
      ref={chartRef}
      {...getChartA11yProps({ testId, title, ariaLabel, ariaDescription }, theme, selectedIndex)}
      style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        padding: isMobile ? '12px' : '16px',
        borderRadius: '8px',
        position: 'relative',
        ...(selectedIndex !== null ? {} : { outline: 'none' }),
      }}
    >
      <Typography
        variant="h6"
        id={`${testId}-title`}
        sx={{
          mb: 2,
          color: isDarkMode ? '#fff' : '#333',
          fontWeight: 600,
          fontSize: isMobile ? '1rem' : '1.25rem'
        }}
      >
        {title}
      </Typography>
      
      {/* スクリーンリーダー用説明 */}
      <div id={`${testId}-desc`} style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
        このグラフは{chartData.length}件のデータポイントで構成されています。
        左右の矢印キーでデータポイント間を移動できます。
        合計は{valueFormatter(dataStats.sum)}、平均は{valueFormatter(dataStats.avg)}です。
      </div>
      
      {/* スクリーンリーダー用通知領域 */}
      <div 
        ref={announcerRef} 
        aria-live="polite" 
        aria-atomic="true"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}
      />
      
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RechartsBarChart
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
            stroke={isDarkMode ? '#333' : '#e0e0e0'}
            vertical={!isMobile}
          />
          
          <XAxis
            dataKey={xAxisKey}
            stroke={isDarkMode ? '#888' : '#666'}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={8}
            label={isMobile ? undefined : {
              value: xAxisLabel || xAxisKey,
              position: 'insideBottom',
              offset: -5,
              style: { fill: isDarkMode ? '#888' : '#666' }
            }}
          />
          
          <YAxis
            stroke={isDarkMode ? '#888' : '#666'}
            tickFormatter={isMobile ? 
              (value) => `${String(value).length > 4 ? `${value/1000}k` : value}` :
              (value) => valueFormatter(value)
            }
            label={isMobile ? undefined : {
              value: yAxisLabel || yAxisKey,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: isDarkMode ? '#888' : '#666' }
            }}
          />
          
          <CustomTooltip
            title={title}
            valueType={yAxisKey === 'amount' ? 'currency' : 'number'}
            testId={`${testId}-tooltip`}
          />
          
          {!isMobile && (
            <Legend
              wrapperStyle={{ color: isDarkMode ? '#888' : '#666' }}
            />
          )}
          
          <Bar
            dataKey={yAxisKey}
            name={yAxisLabel || yAxisKey}
            fill={barColor}
            radius={[4, 4, 0, 0]}
            // キーボード選択中のデータポイントをハイライト
            {...(selectedIndex !== null ? {
              // activeBar プロパティの型が一致しないので削除
              // 代わりに直接スタイルを使用
              style: {
                fill: selectedIndex !== null ? theme.palette.primary.main : barColor,
                filter: selectedIndex !== null ? 'drop-shadow(0px 0px 4px rgba(59, 130, 246, 0.5))' : 'none'
              }
            } : {})}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      
      {/* スクリーンリーダー用の非表示データテーブル */}
      {!hideTable && (
        <div style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }} tabIndex={-1}>
          <table>
            <caption>{title} データ</caption>
            <thead>
              <tr>
                {tableColumns.map((col, idx) => (
                  <th key={idx} scope="col">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr 
                  key={index}
                  {...(selectedIndex === index ? { 'aria-current': 'true' } : {})}
                >
                  {tableColumns.map((col, colIdx) => (
                    <td key={colIdx}>{item[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {summaryData.map((item, idx) => (
                <tr key={idx}>
                  <th scope="row">{item.label}</th>
                  <td colSpan={tableColumns.length - 1}>{item.value}</td>
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      )}
      
      {/* モバイル向けデータサマリー */}
      {isMobile && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: 'center',
            color: isDarkMode ? '#aaa' : '#666',
            fontSize: '0.75rem'
          }}
        >
          合計: {valueFormatter(dataStats.sum)} | 平均: {valueFormatter(dataStats.avg)}
        </Typography>
      )}
    </div>
  );
};