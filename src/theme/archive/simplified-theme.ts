import { createTheme, PaletteMode, Theme } from '@mui/material';

// Minimal theme configuration to avoid type issues
const lightPalette = {
  mode: 'light' as PaletteMode,
  primary: {
    main: '#10b981',
    light: '#4ade80',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#3b82f6',
    light: '#93c5fd',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
  }
};

const darkPalette = {
  mode: 'dark' as PaletteMode,
  primary: {
    main: '#10b981',
    light: '#4ade80',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#3b82f6',
    light: '#93c5fd',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
  }
};

// Create minimal themes without type issues
export const lightTheme = createTheme({
  palette: lightPalette,
});

export const darkTheme = createTheme({
  palette: darkPalette,
});

export const createConeaTheme = (mode: PaletteMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export default lightTheme;