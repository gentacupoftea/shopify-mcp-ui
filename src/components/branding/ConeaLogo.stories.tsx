import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ConeaLogo } from './ConeaLogo';
import { Box, Grid, Paper, useTheme } from '@mui/material';

const meta: Meta<typeof ConeaLogo> = {
  title: 'Branding/ConeaLogo',
  component: ConeaLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Coneaブランドのロゴコンポーネント。複数のバリアントとサイズをサポートし、アニメーション効果を含みます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical', 'icon-only', 'responsive'],
      description: 'ロゴの表示バリアント',
    },
    showTagline: {
      control: 'boolean',
      description: 'タグラインを表示するかどうか',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'ロゴのサイズ',
    },
    animated: {
      control: 'boolean',
      description: 'アニメーション効果を有効にするかどうか',
    },
  },
  args: {
    variant: 'horizontal',
    showTagline: false,
    size: 'md',
    animated: false,
  },
};

export default meta;
type Story = StoryObj<typeof ConeaLogo>;

export const Default: Story = {
  args: {
    variant: 'horizontal',
    showTagline: false,
    size: 'md',
  },
};

export const WithTagline: Story = {
  args: {
    variant: 'horizontal',
    showTagline: true,
    size: 'md',
  },
};

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    showTagline: true,
    size: 'md',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'icon-only',
    size: 'md',
  },
};

export const Animated: Story = {
  args: {
    animated: true,
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <ConeaLogo size="xs" />
          <Box sx={{ mt: 1, ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
            XS (80 x 30)
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <ConeaLogo size="sm" />
          <Box sx={{ mt: 1, ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
            SM (120 x 40)
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <ConeaLogo size="md" />
          <Box sx={{ mt: 1, ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
            MD (160 x 50)
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <ConeaLogo size="lg" />
          <Box sx={{ mt: 1, ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
            LG (220 x 60)
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <ConeaLogo size="xl" />
          <Box sx={{ mt: 1, ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
            XL (280 x 80)
          </Box>
        </Box>
      </Grid>
    </Grid>
  ),
};

export const AllVariants: Story = {
  render: () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ mb: 1, typography: 'subtitle1' }}>標準バリアント</Box>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'background.paper' : '#fff',
            }}
          >
            <ConeaLogo variant="horizontal" showTagline />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1, typography: 'subtitle1' }}>垂直バリアント</Box>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'background.paper' : '#fff',
            }}
          >
            <ConeaLogo variant="vertical" showTagline />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1, typography: 'subtitle1' }}>アイコンのみ</Box>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'background.paper' : '#fff',
            }}
          >
            <ConeaLogo variant="icon-only" />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1, typography: 'subtitle1' }}>クリック可能</Box>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'background.paper' : '#fff',
            }}
          >
            <ConeaLogo onClick={() => alert('Logo clicked!')} />
          </Paper>
        </Grid>
      </Grid>
    );
  },
};

export const WithDifferentBackgrounds: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ mb: 1, typography: 'subtitle1' }}>白背景</Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <ConeaLogo />
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ mb: 1, typography: 'subtitle1' }}>黒背景</Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#111827',
          }}
        >
          <ConeaLogo />
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ mb: 1, typography: 'subtitle1' }}>プライマリカラー背景</Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#10B981',
          }}
        >
          <ConeaLogo />
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ mb: 1, typography: 'subtitle1' }}>グラデーション背景</Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #10B981 0%, #3B82F6 100%)',
          }}
        >
          <ConeaLogo />
        </Paper>
      </Grid>
    </Grid>
  ),
};