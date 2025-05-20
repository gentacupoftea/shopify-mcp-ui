import { createTheme, PaletteMode, Theme } from '@mui/material';

// Basic theme configuration without complex component styling
export const createConeaTheme = (mode: PaletteMode): Theme => {
  // Define core brand colors
  const colors = {
    primary: {
      light: '#4ade80',
      main: '#10b981', 
      dark: '#047857',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#93c5fd',
      main: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    success: {
      light: '#86efac',
      main: '#22c55e',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#fdba74',
      main: '#f97316',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    info: {
      light: '#7dd3fc',
      main: '#0ea5e9',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
  };

  // Background and text colors per mode
  const background = mode === 'light' 
    ? { default: '#f8fafc', paper: '#ffffff' }
    : { default: '#0f172a', paper: '#1e293b' };

  const text = mode === 'light'
    ? { primary: '#0f172a', secondary: '#475569', disabled: '#94a3b8' }
    : { primary: '#f8fafc', secondary: '#cbd5e1', disabled: '#64748b' };

  // Create the theme without component overrides to avoid TypeScript issues
  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      background,
      text,
      divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    // Omit detailed component styling to avoid type errors
  });
};

// Create the default themes
export const lightTheme = createConeaTheme('light');
export const darkTheme = createConeaTheme('dark');

export default lightTheme;