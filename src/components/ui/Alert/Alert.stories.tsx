import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { Box, Button, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'アクセシビリティに準拠したアラートコンポーネント。フィードバックやステータスを表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: 'アラートの重要度',
    },
    title: {
      control: 'text',
      description: 'アラートのタイトル',
    },
    message: {
      control: 'text',
      description: 'アラートのメッセージ',
    },
    closable: {
      control: 'boolean',
      description: '閉じるボタンを表示するかどうか',
    },
    role: {
      control: 'select',
      options: ['alert', 'status', 'log'],
      description: 'アラートのARIAロール',
    },
  },
  args: {
    severity: 'info',
    message: 'これはアラートメッセージです。',
    closable: true,
    role: 'alert',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    severity: 'info',
    title: '情報',
    message: 'システムの更新が利用可能です。',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
    title: '成功',
    message: 'データが正常に保存されました。',
  },
};

export const Warning: Story = {
  args: {
    severity: 'warning',
    title: '警告',
    message: 'この操作は元に戻せません。慎重に進めてください。',
  },
};

export const Error: Story = {
  args: {
    severity: 'error',
    title: 'エラー',
    message: 'データの保存中にエラーが発生しました。もう一度お試しください。',
  },
};

export const WithAction: Story = {
  args: {
    severity: 'info',
    title: '更新',
    message: '新しいバージョンが利用可能です。',
    action: (
      <Button
        variant="text"
        size="small"
        startIcon={<DownloadIcon />}
      >
        更新
      </Button>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    severity: 'success',
    message: 'ログインに成功しました。',
  },
};

export const NotClosable: Story = {
  args: {
    severity: 'warning',
    title: '重要なお知らせ',
    message: 'このメッセージは重要な情報を含んでいます。',
    closable: false,
  },
};

export const StatusRole: Story = {
  args: {
    severity: 'info',
    message: 'データを読み込んでいます...',
    closable: false,
    role: 'status',
    ariaDescription: '現在システムデータを読み込んでいます。しばらくお待ちください。',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      <Alert
        severity="success"
        title="成功"
        message="操作が正常に完了しました。"
        action={
          <Button variant="text" size="small" color="inherit">
            確認
          </Button>
        }
      />
      
      <Alert
        severity="info"
        title="情報"
        message="システムメンテナンスが予定されています。詳細については通知をご確認ください。"
        action={
          <Button variant="text" size="small" color="inherit" startIcon={<RefreshIcon />}>
            更新
          </Button>
        }
      />
      
      <Alert
        severity="warning"
        title="警告"
        message="このアクションを実行する前に、すべてのデータをバックアップすることをお勧めします。"
      />
      
      <Alert
        severity="error"
        title="エラー"
        message="リクエストの処理中にエラーが発生しました。もう一度お試しいただくか、サポートにお問い合わせください。"
      />
    </Stack>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box sx={{ width: '100%' }}>
      <Alert
        severity="info"
        title="レスポンシブアラート"
        message="このアラートは親要素の幅に合わせてサイズが変わります。モバイルデバイスでも適切に表示されます。"
        closable
        sx={{ mb: 2 }}
      />
      
      <Alert
        severity="success"
        message="シンプルなメッセージのみのアラート"
        closable={false}
      />
    </Box>
  ),
};