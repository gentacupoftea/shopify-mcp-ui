/**
 * 言語切替コンポーネント
 * Language Switcher Component
 */
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
  IconButton,
  Menu,
  Tooltip,
  Box,
  useTheme,
} from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";

interface LanguageOption {
  code: string;
  name: string;
  localName: string;
  flag?: string;
  rtl?: boolean;
}

interface LanguageSwitcherProps {
  variant?: "select" | "menu" | "button";
  size?: "small" | "medium";
  showLabel?: boolean;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "ja",
    name: "Japanese",
    localName: "日本語",
    flag: "🇯🇵",
  },
  {
    code: "en",
    name: "English",
    localName: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr", 
    name: "French",
    localName: "Français",
    flag: "🇫🇷",
  },
  {
    code: "ar",
    name: "Arabic",
    localName: "العربية",
    flag: "🇦🇪",
    rtl: true,
  },
];

/**
 * 言語切替コンポーネント
 * 3種類の表示バリエーションをサポート：
 * - select: フォームセレクト
 * - menu: ドロップダウンメニュー
 * - button: 言語ボタン群
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "select",
  size = "medium",
  showLabel = true,
}) => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // 言語変更時に内部状態を更新
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  // 言語変更ハンドラ
  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLang(langCode);
      localStorage.setItem("i18nextLng", langCode);
      setMenuAnchor(null);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  // セレクトフォーム用の変更ハンドラ
  const handleSelectChange = (event: SelectChangeEvent) => {
    handleLanguageChange(event.target.value);
  };

  // メニュー表示ハンドラ
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  // メニュー閉じるハンドラ
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // 現在の言語オプションを取得
  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLang) || SUPPORTED_LANGUAGES[0];
  };

  // セレクトフォームバリアント
  const renderSelectVariant = () => {
    return (
      <FormControl size={size} fullWidth sx={{ minWidth: 120 }}>
        {showLabel && <InputLabel id="language-select-label">Language</InputLabel>}
        <Select
          labelId="language-select-label"
          id="language-select"
          value={currentLang}
          onChange={handleSelectChange}
          label={showLabel ? "Language" : undefined}
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <MenuItem key={lang.code} value={lang.code} dir={lang.rtl ? "rtl" : "ltr"}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>{lang.flag}</span>
                <span>{lang.localName}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // メニューバリアント
  const renderMenuVariant = () => {
    const currentLang = getCurrentLanguage();
    
    return (
      <>
        <Tooltip title="Change language">
          <IconButton
            onClick={handleMenuOpen}
            aria-controls="language-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(menuAnchor) ? "true" : "false"}
            aria-label="Select language"
            size={size}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LanguageIcon />
              {showLabel && (
                <Box component="span" sx={{ ml: 0.5, display: { xs: "none", sm: "inline" } }}>
                  {currentLang.flag} {currentLang.localName}
                </Box>
              )}
            </Box>
          </IconButton>
        </Tooltip>
        <Menu
          id="language-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              selected={lang.code === currentLang.code}
              dir={lang.rtl ? "rtl" : "ltr"}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>{lang.flag}</span>
                <span>{lang.localName}</span>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  // ボタングループバリアント
  const renderButtonVariant = () => {
    return (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={lang.code === currentLang ? "contained" : "outlined"}
            size={size}
            onClick={() => handleLanguageChange(lang.code)}
            sx={{
              minWidth: 0,
              px: showLabel ? 2 : 1,
            }}
            aria-pressed={lang.code === currentLang ? "true" : "false"}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <span>{lang.flag}</span>
              {showLabel && <span>{lang.localName}</span>}
            </Box>
          </Button>
        ))}
      </Box>
    );
  };

  // 選択したバリアントによって表示を切替
  switch (variant) {
    case "menu":
      return renderMenuVariant();
    case "button":
      return renderButtonVariant();
    case "select":
    default:
      return renderSelectVariant();
  }
};

export default LanguageSwitcher;