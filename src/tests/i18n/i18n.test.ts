/**
 * i18n実装のテスト
 * Tests for i18n implementation
 */
import i18n, { 
  setDocumentDirection, 
  getDateFormatter, 
  getNumberFormatter, 
  getCurrencyFormatter 
} from '../../i18n';
import { 
  formatDate, 
  formatNumber, 
  formatCurrency, 
  formatPercent 
} from '../../utils/i18n-formatter';
import { isRTLLanguage } from '../../utils/rtl';

// モックする必要がある場合はここで設定
jest.mock('../../i18n', () => {
  const originalModule = jest.requireActual('../../i18n');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      language: 'ja',
      changeLanguage: jest.fn((lang) => {
        // 言語変更時にmockされた言語を更新
        const module = jest.requireActual('../../i18n').default;
        module.language = lang;
        return Promise.resolve();
      }),
      t: jest.fn((key, options) => {
        // 簡単な翻訳モック
        const translations: Record<string, Record<string, string>> = {
          ja: {
            'common.save': '保存',
            'common.cancel': 'キャンセル',
            'greeting': 'こんにちは、{{name}}さん',
          },
          en: {
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'greeting': 'Hello, {{name}}',
          },
          fr: {
            'common.save': 'Enregistrer',
            'common.cancel': 'Annuler',
            'greeting': 'Bonjour, {{name}}',
          },
          ar: {
            'common.save': 'حفظ',
            'common.cancel': 'إلغاء',
            'greeting': 'مرحبا، {{name}}',
          },
        };
        
        // 現在の言語の翻訳を取得
        const i18nModule = jest.requireActual('../../i18n').default;
        const currentLang = i18nModule.language || 'ja';
        const langTranslations = translations[currentLang] || translations.en;
        
        // 対応する翻訳を返す
        let text = langTranslations[key] || key;
        
        // 変数置換
        if (options) {
          Object.entries(options).forEach(([k, v]) => {
            text = text.replace(`{{${k}}}`, String(v));
          });
        }
        
        return text;
      }),
    },
  };
});

describe('i18n implementation', () => {
  // 各テスト後に状態をリセット
  afterEach(() => {
    jest.clearAllMocks();
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'ja';
  });
  
  test('should change language properly', async () => {
    // 言語を英語に変更
    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
    
    // 言語をフランス語に変更
    await i18n.changeLanguage('fr');
    expect(i18n.language).toBe('fr');
  });
  
  test('should translate strings correctly', () => {
    // 日本語の翻訳
    i18n.language = 'ja';
    expect(i18n.t('common.save')).toBe('保存');
    
    // 英語の翻訳
    i18n.language = 'en';
    expect(i18n.t('common.save')).toBe('Save');
    
    // フランス語の翻訳
    i18n.language = 'fr';
    expect(i18n.t('common.save')).toBe('Enregistrer');
    
    // アラビア語の翻訳
    i18n.language = 'ar';
    expect(i18n.t('common.save')).toBe('حفظ');
  });
  
  test('should handle variables in translations', () => {
    i18n.language = 'ja';
    expect(i18n.t('greeting', { name: '山田' })).toBe('こんにちは、山田さん');
    
    i18n.language = 'en';
    expect(i18n.t('greeting', { name: 'Yamada' })).toBe('Hello, Yamada');
  });
  
  test('should set document direction based on language', () => {
    // LTR言語
    setDocumentDirection('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
    
    // RTL言語
    setDocumentDirection('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });
  
  test('should detect RTL languages correctly', () => {
    expect(isRTLLanguage('ar')).toBe(true);
    expect(isRTLLanguage('he')).toBe(true);
    expect(isRTLLanguage('fa')).toBe(true);
    expect(isRTLLanguage('en')).toBe(false);
    expect(isRTLLanguage('ja')).toBe(false);
  });
  
  test('should format dates according to locale', () => {
    // 日付の準備
    const testDate = new Date(2024, 0, 15); // 2024年1月15日
    
    // 日本語フォーマット
    i18n.language = 'ja';
    const jaFormatter = getDateFormatter();
    expect(jaFormatter.format(testDate)).toContain('2024');
    
    // 英語フォーマット
    i18n.language = 'en';
    const enFormatter = getDateFormatter();
    expect(enFormatter.format(testDate)).toContain('2024');
  });
  
  test('should format numbers according to locale', () => {
    const testNumber = 1234567.89;
    
    // 日本語フォーマット
    i18n.language = 'ja';
    const jaFormatter = getNumberFormatter();
    expect(jaFormatter.format(testNumber)).toBe('1,234,567.89');
    
    // 英語フォーマット 
    i18n.language = 'en';
    const enFormatter = getNumberFormatter();
    expect(enFormatter.format(testNumber)).toBe('1,234,567.89');
  });
  
  test('should format currency according to locale', () => {
    const testAmount = 1234.56;
    
    // 日本語フォーマット
    i18n.language = 'ja';
    const jaFormatter = getCurrencyFormatter('JPY');
    expect(jaFormatter.format(testAmount)).toContain('JP');
    
    // 英語フォーマット - USD
    i18n.language = 'en';
    const enFormatter = getCurrencyFormatter('USD');
    expect(enFormatter.format(testAmount)).toContain('$');
  });
  
  test('should format percentage according to locale', () => {
    const testPercentage = 0.1234; // 12.34%
    
    // 日本語フォーマット
    i18n.language = 'ja';
    expect(formatPercent(testPercentage)).toBe('12.3%');
    
    // 英語フォーマット
    i18n.language = 'en';
    expect(formatPercent(testPercentage)).toBe('12.3%');
  });
});