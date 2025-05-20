import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'バッジコンポーネントはステータス表示やカウンター、通知などの小さなインジケーターとして使用します。'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'バッジのラベルまたは数値',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default'],
      description: 'バッジの色',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'バッジのサイズ',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text', 'ghost'],
      description: 'バッジのスタイルバリアント',
    },
    standalone: {
      control: 'boolean',
      description: 'スタンドアロン(Chip)として表示するかどうか',
    },
    overlap: {
      control: 'select',
      options: ['rectangular', 'circular'],
      description: 'バッジのオーバーラップスタイル',
    },
  },
  args: {
    label: '新規',
    color: 'primary',
    size: 'md',
    variant: 'filled',
    standalone: true,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// スタンドアロンバッジ（チップスタイル）のストーリー
export const Standalone: Story = {
  args: {
    label: '新規',
    standalone: true,
  },
};

export const StandaloneWithIcon: Story = {
  args: {
    label: '完了',
    color: 'success',
    icon: <CheckCircleIcon />,
    standalone: true,
  },
};

export const StatusBadges: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Badge label="成功" color="success" standalone icon={<CheckCircleIcon />} />
      <Badge label="エラー" color="error" standalone icon={<ErrorIcon />} />
      <Badge label="警告" color="warning" standalone icon={<WarningIcon />} />
      <Badge label="情報" color="info" standalone icon={<InfoIcon />} />
      <Badge label="プライマリ" color="primary" standalone />
      <Badge label="セカンダリ" color="secondary" standalone />
    </Box>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge label="XS" size="xs" standalone />
      <Badge label="SM" size="sm" standalone />
      <Badge label="MD" size="md" standalone />
      <Badge label="LG" size="lg" standalone />
      <Badge label="XL" size="xl" standalone />
    </Box>
  ),
};

export const StyleVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Badge label="塗りつぶし" variant="filled" standalone />
      <Badge label="アウトライン" variant="outlined" standalone />
      <Badge label="テキスト" variant="text" standalone />
      <Badge label="ゴースト" variant="ghost" standalone />
    </Box>
  ),
};

// 通常バッジ（他の要素に付与するスタイル）のストーリー
export const NotificationBadge: Story = {
  args: {
    label: '5',
    standalone: false,
    children: (
      <NotificationsIcon sx={{ fontSize: 24 }} />
    ),
  },
};

export const MailBadge: Story = {
  args: {
    label: '99+',
    color: 'error',
    standalone: false,
    children: (
      <MailIcon sx={{ fontSize: 24 }} />
    ),
  },
};

export const AvatarBadge: Story = {
  args: {
    label: '',
    color: 'success',
    size: 'sm',
    standalone: false,
    overlap: 'circular',
    children: (
      <Avatar sx={{ width: 40, height: 40 }}>CN</Avatar>
    ),
  },
};

export const BadgeVariants: Story = {
  render: () => (
    <Grid container spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          バッジスタイルバリエーション
        </Typography>
      </Grid>
      
      {/* 塗りつぶしバリアント */}
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="5" variant="filled" standalone={false} color="primary">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Grid>
      
      {/* アウトラインバリアント */}
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="5" variant="outlined" standalone={false} color="primary">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Grid>
      
      {/* テキストバリアント */}
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="5" variant="text" standalone={false} color="primary">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Grid>
      
      {/* ゴーストバリアント */}
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="5" variant="ghost" standalone={false} color="primary">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Grid>
      
      {/* 異なる色のバッジ */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          異なる色のバッジ
        </Typography>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="3" standalone={false} color="primary">
            <MailIcon />
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="7" standalone={false} color="secondary">
            <MailIcon />
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="12" standalone={false} color="error">
            <MailIcon />
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="24" standalone={false} color="info">
            <MailIcon />
          </Badge>
        </Box>
      </Grid>
      
      {/* アバターへの適用例 */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          アバターの状態表示
        </Typography>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="" standalone={false} color="success" overlap="circular">
            <Avatar>JD</Avatar>
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="" standalone={false} color="warning" overlap="circular">
            <Avatar>MS</Avatar>
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="" standalone={false} color="error" overlap="circular">
            <Avatar>KT</Avatar>
          </Badge>
        </Box>
      </Grid>
      
      <Grid item xs={6} md={3}>
        <Box sx={{ p: 1 }}>
          <Badge label="" standalone={false} color="primary" overlap="circular">
            <Avatar>YS</Avatar>
          </Badge>
        </Box>
      </Grid>
    </Grid>
  ),
};