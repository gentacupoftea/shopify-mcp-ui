// Type fixes for Material UI theme
import '@mui/material/styles';

// Override the problematic types
declare module '@mui/material/styles' {
  interface Components {
    // Allow any for component styleOverrides to bypass type checking
    MuiButton?: {
      styleOverrides?: {
        root?: any;
      }
    };
    MuiCard?: {
      styleOverrides?: {
        root?: any;
      }
    };
    MuiPaper?: {
      styleOverrides?: {
        rounded?: any;
      }
    };
    MuiDrawer?: {
      styleOverrides?: {
        paper?: any;
      }
    };
    MuiTab?: {
      styleOverrides?: {
        root?: any;
      }
    };
    MuiTableCell?: {
      styleOverrides?: {
        head?: any;
      }
    };
    MuiChip?: {
      styleOverrides?: {
        root?: any;
      }
    };
  }
}