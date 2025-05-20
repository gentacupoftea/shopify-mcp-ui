import React, { useState, ChangeEvent } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Box, Grid, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'アクセシビリティに準拠した入力フィールドコンポーネント。様々なタイプと状態をサポートします。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '入力フィールドのラベル',
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    helperText: {
      control: 'text',
      description: 'ヘルプテキスト',
    },
    error: {
      control: 'text',
      description: 'エラーメッセージ',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
      description: '入力タイプ',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '入力フィールドのサイズ',
    },
    required: {
      control: 'boolean',
      description: '必須フィールドかどうか',
    },
    disabled: {
      control: 'boolean',
      description: '無効化されているかどうか',
    },
    rounded: {
      control: 'boolean',
      description: '角を丸くするかどうか',
    },
    maxLength: {
      control: 'number',
      description: '最大文字数',
    },
    customVariant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: '入力フィールドのバリアント',
    },
  },
  args: {
    label: 'ラベル',
    placeholder: 'プレースホルダー',
    type: 'text',
    size: 'md',
    required: false,
    disabled: false,
    rounded: false,
    customVariant: 'outlined',
    value: '',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: '名前',
    placeholder: '名前を入力',
    helperText: 'フルネームを入力してください',
  },
};

export const WithIcon: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: '検索',
    placeholder: '検索ワードを入力',
    startIcon: <SearchIcon />,
    type: 'search',
  },
};

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    
    return (
      <Input
        label="パスワード"
        placeholder="パスワードを入力"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
        startIcon={<LockIcon />}
        endIcon={
          showPassword ? (
            <VisibilityIcon 
              style={{ cursor: 'pointer' }} 
              onClick={togglePasswordVisibility} 
            />
          ) : (
            <VisibilityOffIcon 
              style={{ cursor: 'pointer' }} 
              onClick={togglePasswordVisibility} 
            />
          )
        }
        required
        helperText="8文字以上で、大文字、小文字、数字を含めてください"
      />
    );
  },
};

export const WithError: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('example@mail');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: 'メールアドレス',
    type: 'email',
    startIcon: <EmailIcon />,
    error: '有効なメールアドレスを入力してください',
  },
};

export const Disabled: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('読み取り専用データ');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: '無効フィールド',
    disabled: true,
  },
};

export const WithCharCounter: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: 'コメント',
    placeholder: 'コメントを入力',
    maxLength: 100,
  },
};

export const Rounded: Story = {
  render: (args: any) => {
    const [value, setValue] = useState('');
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => setValue(typeof e === 'string' ? e : e.target.value)}
      />
    );
  },
  args: {
    label: '検索',
    placeholder: '検索ワードを入力',
    startIcon: <SearchIcon />,
    rounded: true,
    type: 'search',
  },
};

export const Sizes: Story = {
  render: () => {
    const [values, setValues] = useState({
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    });
    
    const handleChange = (size: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === 'string' ? e : e.target.value;
      setValues({
        ...values,
        [size]: newValue,
      });
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Input
          label="超小型サイズ"
          placeholder="XS"
          size="xs"
          value={values.xs}
          onChange={handleChange('xs')}
        />
        <Input
          label="小型サイズ"
          placeholder="SM"
          size="sm"
          value={values.sm}
          onChange={handleChange('sm')}
        />
        <Input
          label="中型サイズ"
          placeholder="MD"
          size="md"
          value={values.md}
          onChange={handleChange('md')}
        />
        <Input
          label="大型サイズ"
          placeholder="LG"
          size="lg"
          value={values.lg}
          onChange={handleChange('lg')}
        />
        <Input
          label="超大型サイズ"
          placeholder="XL"
          size="xl"
          value={values.xl}
          onChange={handleChange('xl')}
        />
      </Box>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [values, setValues] = useState({
      outlined: '',
      filled: '',
      standard: '',
    });
    
    const handleChange = (variant: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === 'string' ? e : e.target.value;
      setValues({
        ...values,
        [variant]: newValue,
      });
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Input
          label="アウトラインバリアント"
          placeholder="Outlined"
          customVariant="outlined"
          value={values.outlined}
          onChange={handleChange('outlined')}
        />
        <Input
          label="塗りつぶしバリアント"
          placeholder="Filled"
          customVariant="filled"
          value={values.filled}
          onChange={handleChange('filled')}
        />
        <Input
          label="標準バリアント"
          placeholder="Standard"
          customVariant="standard"
          value={values.standard}
          onChange={handleChange('standard')}
        />
      </Box>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [values, setValues] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    
    const [errors, setErrors] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    
    const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === 'string' ? e : e.target.value;
      setValues({
        ...values,
        [field]: newValue,
      });
      
      // 簡単なバリデーション例
      if (field === 'email' && newValue && !newValue.includes('@')) {
        setErrors({
          ...errors,
          email: '有効なメールアドレスを入力してください',
        });
      } else if (field === 'password' && newValue && newValue.length < 8) {
        setErrors({
          ...errors,
          password: 'パスワードは8文字以上必要です',
        });
      } else {
        setErrors({
          ...errors,
          [field]: '',
        });
      }
    };
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          アカウント登録フォーム
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              label="名"
              placeholder="名を入力"
              required
              value={values.firstName}
              onChange={handleChange('firstName')}
              error={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="姓"
              placeholder="姓を入力"
              required
              value={values.lastName}
              onChange={handleChange('lastName')}
              error={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="メールアドレス"
              placeholder="メールアドレスを入力"
              required
              type="email"
              startIcon={<EmailIcon />}
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="パスワード"
              placeholder="パスワードを入力"
              required
              type="password"
              startIcon={<LockIcon />}
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              helperText="8文字以上で、大文字、小文字、数字を含めてください"
            />
          </Grid>
        </Grid>
      </Box>
    );
  },
};