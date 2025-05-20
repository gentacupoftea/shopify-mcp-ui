/**
 * Coneaテーマを提供するコンポーネント
 * ライトモードとダークモードの切り替えをサポート
 */
import React, { createContext, useState, useEffect, useContext, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { createConeaTheme } from './index';

// テーマ設定のコンテキスト型
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  setThemeMode: (mode: PaletteMode) => void;
}

// デフォルトのコンテキスト値
const defaultContext: ThemeContextType = {
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
};

// テーマコンテキストの作成
export const ThemeContext = createContext<ThemeContextType>(defaultContext);

// テーマフックの定義
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: PaletteMode;
}

/**
 * テーマプロバイダーコンポーネント
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  // ローカルストレージからテーマモードを取得
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('conea-theme-mode');
    return (savedMode as PaletteMode) || defaultMode;
  });

  // テーマオブジェクトの作成
  const theme = useMemo(() => createConeaTheme(mode), [mode]);

  // テーマモードの切り替え
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // 特定のテーマモードの設定
  const setThemeMode = (newMode: PaletteMode) => {
    setMode(newMode);
  };

  // テーマモードの変更をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('conea-theme-mode', mode);
    
    // HTMLのdata-theme属性も更新（Tailwind暗黒モード用）
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.setAttribute('data-theme', mode);
  }, [mode]);

  // コンテキスト値
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setThemeMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;