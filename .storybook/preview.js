import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import '../src/index.css';

const withThemeProvider = (Story, context) => {
  const { globals } = context;
  const { theme: themeKey } = globals;
  
  const theme = useMemo(() => {
    const mode = themeKey || 'light';
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#10B981', // Conea ブランドカラー（グリーン）
        },
        secondary: {
          main: '#3B82F6',
        },
        background: {
          default: mode === 'light' ? '#F9FAFB' : '#111827',
          paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
        },
      },
      typography: {
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
      },
    });
  }, [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'sun', title: 'Light' },
        { value: 'dark', icon: 'moon', title: 'Dark' },
      ],
      showName: true,
    },
  },
};

export const decorators = [withThemeProvider];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: true,
        },
      ],
    },
  },
  docs: {
    source: {
      state: 'open',
    },
  },
};