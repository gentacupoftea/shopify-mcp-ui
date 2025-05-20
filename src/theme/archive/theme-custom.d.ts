// Type declaration to fix MUI theme type issues
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    // Ensure textTransform property has appropriate types
    button: {
      textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    };
    overline: {
      textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    };
  }
  
  interface Components {
    // Override Components to make it type-compatible
    MuiButton?: {
      styleOverrides?: {
        root?: any;
      };
    };
  }
}