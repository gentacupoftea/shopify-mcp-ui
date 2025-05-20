/**
 * LanguageSwitcherコンポーネントのテスト
 * Tests for LanguageSwitcher component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import i18n from '../../i18n';

// i18nのモック
jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    language: 'ja',
    changeLanguage: jest.fn(() => Promise.resolve()),
  },
}));

// react-i18nextのモック
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'ja',
      changeLanguage: jest.fn((lng) => {
        // モック実装内でlanguageプロパティを更新
        const i18nMock = require('../../i18n').default;
        i18nMock.language = lng;
        return Promise.resolve();
      }),
    },
  }),
}));

describe('LanguageSwitcher Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders select variant correctly', () => {
    render(<LanguageSwitcher variant="select" />);
    
    // セレクトコンポーネントが存在することを確認
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders menu variant correctly', () => {
    render(<LanguageSwitcher variant="menu" />);
    
    // メニューボタンが存在することを確認
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders button variant correctly', () => {
    render(<LanguageSwitcher variant="button" />);
    
    // 言語ボタンが存在することを確認
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('changes language when option is selected in select variant', async () => {
    render(<LanguageSwitcher variant="select" />);
    
    // セレクト要素を取得
    const selectElement = screen.getByRole('combobox');
    
    // セレクトをクリック
    fireEvent.mouseDown(selectElement);
    
    // 英語オプションを探してクリック
    const englishOption = await screen.findByText('English');
    fireEvent.click(englishOption);
    
    // 言語変更が呼ばれたことを確認
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
  });

  test('changes language when button is clicked in button variant', () => {
    render(<LanguageSwitcher variant="button" />);
    
    // 英語ボタンを探してクリック
    const buttons = screen.getAllByRole('button');
    const englishButton = buttons.find(
      button => button.textContent?.includes('English')
    );
    
    if (englishButton) {
      fireEvent.click(englishButton);
      
      // 言語変更が呼ばれたことを確認
      expect(i18n.changeLanguage).toHaveBeenCalled();
    } else {
      fail('English button not found');
    }
  });

  test('handles size prop correctly', () => {
    render(<LanguageSwitcher variant="select" size="small" />);
    
    // small サイズのセレクトが存在することを確認
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('MuiInputBase-inputSizeSmall');
  });

  test('handles showLabel prop correctly', () => {
    // showLabel={false}の場合
    render(<LanguageSwitcher variant="select" showLabel={false} />);
    
    // ラベルが表示されていないことを確認
    const labelElement = screen.queryByLabelText('Language');
    expect(labelElement).not.toBeInTheDocument();
  });
});