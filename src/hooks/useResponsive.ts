/**
 * レスポンシブデザイン用のカスタムフック
 * useMediaQueryをラップして一貫したブレイクポイントを提供
 */
import { useMediaQuery, useTheme } from "@mui/material";
import { DEVICE_QUERIES, DeviceType } from "../constants/breakpoints";

interface ResponsiveHelpers {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isDevice: (device: DeviceType) => boolean;
  active: DeviceType;
}

export const useResponsive = (): ResponsiveHelpers => {
  const theme = useTheme();

  // Material UIのuseMediaQueryを使用して各デバイスタイプをチェック
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // 現在アクティブなデバイスタイプを判定
  let active: DeviceType = "desktop";
  if (isMobile) active = "mobile";
  else if (isTablet) active = "tablet";
  else if (isLargeDesktop) active = "largeDesktop";

  // 特定のデバイスタイプかどうかをチェックする関数
  const isDevice = (device: DeviceType): boolean => {
    switch (device) {
      case "mobile":
        return isMobile;
      case "tablet":
        return isTablet;
      case "desktop":
        return isDesktop && !isLargeDesktop;
      case "largeDesktop":
        return isLargeDesktop;
      default:
        return false;
    }
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isDevice,
    active,
  };
};

export default useResponsive;
