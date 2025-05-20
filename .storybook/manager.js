import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  
  // ブランドカラー
  colorPrimary: '#10B981',
  colorSecondary: '#3B82F6',
  
  // UI
  appBg: '#F9FAFB',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Inter", "Noto Sans JP", sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#111827',
  textInverseColor: '#FFFFFF',
  
  // Toolbar default and active colors
  barTextColor: '#6B7280',
  barSelectedColor: '#10B981',
  barBg: '#FFFFFF',
  
  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputTextColor: '#111827',
  inputBorderRadius: 4,
  
  // Brand
  brandTitle: 'Conea UI',
  brandUrl: 'https://conea.ai',
  brandImage: '/logo.png',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
  showToolbar: true,
});