import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Avatar, Box, Chip, Grid, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'アクセシビリティに準拠したカードコンポーネント。コンテンツをグループ化し、情報を整理して表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'カードのタイトル',
    },
    subtitle: {
      control: 'text',
      description: 'カードのサブタイトル',
    },
    variant: {
      control: 'select',
      options: ['outlined', 'elevated', 'filled', 'glass'],
      description: 'カードのスタイルバリアント',
    },
    shadow: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: '影の大きさ',
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: '内部パディングのサイズ',
    },
    hoverable: {
      control: 'boolean',
      description: 'ホバー効果を適用するかどうか',
    },
    clickable: {
      control: 'boolean',
      description: 'クリック可能かどうか',
    },
    height: {
      control: 'text',
      description: 'カードの高さ（CSS値）',
    },
    width: {
      control: 'text',
      description: 'カードの幅（CSS値）',
    },
  },
  args: {
    title: 'カードタイトル',
    subtitle: 'サブタイトル',
    variant: 'outlined',
    shadow: 'medium',
    padding: 'medium',
    hoverable: false,
    clickable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <Typography variant="body2" color="text.secondary">
        カードの基本的な使い方です。タイトル、サブタイトル、コンテンツを表示できます。
        コンテンツはテキスト、画像、リスト、その他のコンポーネントなど、あらゆる要素を含めることができます。
      </Typography>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'アクション付きカード',
    subtitle: 'メニューボタン付き',
    action: (
      <IconButton aria-label="設定">
        <MoreVertIcon />
      </IconButton>
    ),
    children: (
      <Typography variant="body2" color="text.secondary">
        カードの右上にアクションボタンを配置できます。
        ドロップダウンメニュー、編集ボタン、閉じるボタンなどを表示するのに適しています。
      </Typography>
    ),
    footer: (
      <>
        <Button variant="text" size="sm" label="詳細" />
        <Button variant="text" size="sm" label="共有" />
      </>
    ),
  },
};

export const WithAvatar: Story = {
  args: {
    title: 'アバター付きカード',
    subtitle: 'ユーザー情報',
    avatar: (
      <Avatar sx={{ bgcolor: 'primary.main' }}>C</Avatar>
    ),
    children: (
      <Typography variant="body2" color="text.secondary">
        カードの左側にアバターを配置できます。
        ユーザープロフィール、通知、メッセージなどの表示に適しています。
      </Typography>
    ),
  },
};

export const Elevated: Story = {
  args: {
    title: '浮き上がったカード',
    variant: 'elevated',
    children: (
      <Typography variant="body2" color="text.secondary">
        このカードは影を使って浮き上がって見えます。
        重要な情報や注目してほしいコンテンツに使用します。
      </Typography>
    ),
  },
};

export const Filled: Story = {
  args: {
    title: '塗りつぶしカード',
    variant: 'filled',
    children: (
      <Typography variant="body2" color="text.secondary">
        このカードは背景色が塗りつぶされています。
        他のカードと区別したい場合に使用します。
      </Typography>
    ),
  },
};

export const Glass: Story = {
  args: {
    title: 'ガラスカード',
    variant: 'glass',
    shadow: 'small',
    children: (
      <Typography variant="body2" color="text.secondary">
        このカードはガラス効果（半透明）を適用しています。
        モダンなデザインに適しています。
      </Typography>
    ),
  },
  parameters: {
    backgrounds: { 
      default: 'gradient', 
      values: [
        { name: 'gradient', value: 'linear-gradient(45deg, #10B981 0%, #3B82F6 100%)' },
      ]
    },
  },
};

export const Hoverable: Story = {
  args: {
    title: 'ホバー効果付きカード',
    hoverable: true,
    children: (
      <Typography variant="body2" color="text.secondary">
        マウスを乗せると浮き上がるエフェクトが適用されます。
        インタラクティブな要素であることを示すのに適しています。
      </Typography>
    ),
  },
};

export const Clickable: Story = {
  args: {
    title: 'クリック可能カード',
    hoverable: true,
    clickable: true,
    onClick: () => alert('カードがクリックされました！'),
    children: (
      <Typography variant="body2" color="text.secondary">
        このカードはクリックできます。クリックするとアクションが実行されます。
        ホバー効果と組み合わせると、より明確にインタラクティブであることを示せます。
      </Typography>
    ),
  },
};

export const CustomSized: Story = {
  args: {
    title: 'カスタムサイズ',
    height: '200px',
    width: '300px',
    children: (
      <Typography variant="body2" color="text.secondary">
        このカードは高さと幅が指定されています。
        グリッドレイアウトや一定のサイズが必要な場合に便利です。
      </Typography>
    ),
  },
};

export const CardGrid: Story = {
  render: () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card
            title={`カード ${item}`}
            hoverable
            clickable
            variant="outlined"
            shadow="small"
            onClick={() => alert(`カード ${item} がクリックされました！`)}
          >
            <Typography variant="body2" color="text.secondary">
              グリッドレイアウトでのカード表示例です。
              レスポンシブデザインに適しています。
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  ),
};

export const MediaCard: Story = {
  render: () => (
    <Card 
      title="メディアカード"
      subtitle="画像付きカード"
      hoverable
      action={
        <Chip 
          label="新着" 
          size="small" 
          color="primary" 
        />
      }
      footer={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <IconButton aria-label="いいね">
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="シェア">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button label="詳細を見る" size="sm" />
        </Box>
      }
    >
      <Box sx={{ p: 0 }}>
        <img 
          src="https://source.unsplash.com/random/800x450?nature" 
          alt="風景画像"
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover',
            borderRadius: '4px',
            marginBottom: '16px'
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          メディアコンテンツを含むカードの表示例です。
          画像やビデオなどのメディアを表示するのに適しています。
        </Typography>
      </Box>
    </Card>
  ),
};