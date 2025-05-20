import React, { useEffect } from "react";
import { Container, Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { ThemeWrapper } from "../components/layout/ThemeWrapper";

/**
 * 方向性対応のためのスタイル
 * RTL (Right-to-Left) 言語をサポート
 */
const getRTLStyles = (isRTL: boolean) => {
  if (!isRTL) return {};
  
  return {
    "& .MuiTableCell-root": {
      textAlign: "right",
    },
    "& .MuiInputBase-input": {
      textAlign: "right",
    },
    "& .MuiFormLabel-root": {
      right: 0,
      left: "auto",
      transformOrigin: "right top",
    },
    "& .MuiInputAdornment-root": {
      marginLeft: 0,
      marginRight: "8px",
    },
    "& .MuiListItemIcon-root": {
      marginRight: 0,
      marginLeft: "16px",
    },
  };
};

/**
 * メインレイアウトHOC
 * 共通レイアウト要素を提供するラッパー
 */
export const mainLayout = (Component: React.ComponentType) => {
  return (props: any) => {
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 600 : false;
    
    // 現在の言語が RTL かどうか
    const isRTL = document.dir === "rtl";
    const rtlStyles = getRTLStyles(isRTL);
    
    const handleMenuClick = () => {
      setSidebarOpen(!sidebarOpen);
    };
    
    const handleSidebarClose = () => {
      setSidebarOpen(false);
    };
    
    return (
      <ThemeWrapper>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            ...rtlStyles,
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CssBaseline />
          <Header 
            onMenuClick={handleMenuClick} 
            isMobile={isMobile} 
          />
          <Sidebar 
            open={sidebarOpen}
            onClose={handleSidebarClose}
            variant={isMobile ? "temporary" : "permanent"}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              mt: 8, // ヘッダーの高さ分
              ml: { xs: 0, md: 8 }, // サイドバーの幅分
              width: { xs: "100%", md: `calc(100% - 64px)` },
            }}
          >
            <Container 
              maxWidth={false} 
              sx={{ 
                px: { xs: 1, sm: 2, md: 3 }, 
                py: { xs: 2, sm: 3 },
              }}
            >
              <Component {...props} />
            </Container>
          </Box>
        </Box>
      </ThemeWrapper>
    );
  };
};
