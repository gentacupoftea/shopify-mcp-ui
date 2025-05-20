import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'アクセシビリティに準拠した拡張ボタンコンポーネント。さまざまなバリエーションと状態をサポートします。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'ボタンのテキスト',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text', 'ghost'],
      description: 'ボタンのスタイルバリアント',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'default'],
      description: 'ボタンの色',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'ボタンのサイズ',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'],
      description: 'ボタンの状態',
    },
    rounded: {
      control: 'boolean',
      description: '角を完全に丸くするかどうか',
    },
    gradient: {
      control: 'boolean',
      description: 'グラデーション効果を適用するかどうか',
    },
    fullWidth: {
      control: 'boolean',
      description: '親要素の幅いっぱいに広げるかどうか',
    },
  },
  args: {
    label: 'ボタン',
    variant: 'filled',
    color: 'primary',
    size: 'md',
    state: 'default',
    rounded: false,
    gradient: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'プライマリボタン',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'セカンダリボタン',
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: '成功',
    color: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: '警告',
    color: 'warning',
  },
};

export const Error: Story = {
  args: {
    label: 'エラー',
    color: 'error',
  },
};

export const Outlined: Story = {
  args: {
    label: 'アウトライン',
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    label: 'テキスト',
    variant: 'text',
  },
};

export const Ghost: Story = {
  args: {
    label: 'ゴースト',
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    label: '無効',
    state: 'disabled',
  },
};

export const Loading: Story = {
  args: {
    label: '読み込み中',
    state: 'loading',
  },
};

export const Small: Story = {
  args: {
    label: '小',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: '大',
    size: 'lg',
  },
};

export const Rounded: Story = {
  args: {
    label: '丸型',
    rounded: true,
  },
};

export const Gradient: Story = {
  args: {
    label: 'グラデーション',
    gradient: true,
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'アイコン付き',
    startIcon: <AddIcon />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: '削除',
    endIcon: <DeleteIcon />,
    color: 'error',
  },
};

export const FullWidth: Story = {
  args: {
    label: '全幅',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button label="保存" color="primary" />
      <Button label="キャンセル" variant="outlined" />
      <Button label="削除" color="error" variant="text" />
    </Box>
  ),
};