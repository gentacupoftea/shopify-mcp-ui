import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={2}
        >
          <Typography variant="h5" gutterBottom>
            申し訳ございません。エラーが発生しました。
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            {this.state.error?.message}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;