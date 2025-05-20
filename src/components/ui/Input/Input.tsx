/**
 * 入力フィールドコンポーネント
 * アクセシビリティに準拠したMaterial UIベースの入力フィールド
 */
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  FormHelperText,
  FormControl,
  InputLabel,
  TextFieldProps,
  useTheme,
  alpha,
  InputBaseProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { InputProps, ComponentSize } from '../../../types/component';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { accessibleFocusStyle } from '../../../utils/accessibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// MUIのTextFieldPropsから必要なプロパティを抽出
type ExtendedTextFieldProps = Omit<
  TextFieldProps,
  | 'size'
  | 'variant'
  | 'error'
  | 'disabled'
  | 'placeholder'
  | 'label'
  | 'helperText'
  | 'fullWidth'
  | 'required'
  | 'sx'
  | 'InputProps'
>;

// 内部使用の入力プロパティ
type CommonProps = {
  rounded?: boolean;
  noAnimation?: boolean;
  customVariant?: 'standard' | 'outlined' | 'filled';
};

// This approach avoids extending conflicting interfaces directly
interface InternalInputProps extends CommonProps {
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void);
  role?: string;
  type?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
  testId?: string;
  sx?: SxProps<Theme>;
  ariaLabel?: string;
  ariaDescription?: string;
}

// スタイル付きTextField
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => 
    !['rounded', 'customSize', 'noAnimation', 'customState'].includes(prop as string),
})<{
  rounded?: boolean;
  customSize?: string;
  noAnimation?: boolean;
  customState?: string;
}>(({ theme, rounded, customSize, noAnimation, customState }) => {
  const getInputHeight = () => {
    switch (customSize) {
      case 'xs': return '32px';
      case 'sm': return '36px';
      case 'md': return '40px';
      case 'lg': return '48px';
      case 'xl': return '56px';
      default: return '40px';
    }
  };

  const getFontSize = () => {
    switch (customSize) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.8125rem';
      case 'md': return '0.875rem';
      case 'lg': return '1rem';
      case 'xl': return '1.125rem';
      default: return '0.875rem';
    }
  };

  const getLabelSize = () => {
    switch (customSize) {
      case 'xs': return '0.7rem';
      case 'sm': return '0.75rem';
      case 'md': return '0.8rem';
      case 'lg': return '0.875rem';
      case 'xl': return '0.95rem';
      default: return '0.8rem';
    }
  };

  return {
    marginTop: '8px',
    
    '& .MuiInputBase-root': {
      height: getInputHeight(),
      borderRadius: rounded ? '50px' : theme.shape.borderRadius,
      fontSize: getFontSize(),
      transition: noAnimation ? 'none' : 'all 0.2s ease-in-out',
      
      // 状態に基づくスタイル
      ...(customState === 'focus' && {
        ...accessibleFocusStyle(theme),
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
      }),
      
      ...(customState === 'error' && {
        borderColor: theme.palette.error.main,
      }),
      
      // ホバー効果
      '&:hover': {
        transform: noAnimation ? 'none' : 'translateY(-1px)',
        
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.common.white, 0.25)
            : alpha(theme.palette.common.black, 0.3),
        },
      },
      
      // フォーカス効果
      '&.Mui-focused': {
        transform: noAnimation ? 'none' : 'translateY(-1px)',
        boxShadow: noAnimation ? 'none' : `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
        
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '2px',
        },
      },
    },
    
    // ラベルのスタイル
    '& .MuiInputLabel-root': {
      fontSize: getLabelSize(),
      transform: customSize === 'xs' || customSize === 'sm'
        ? 'translate(14px, 9px) scale(1)'
        : customSize === 'lg' || customSize === 'xl'
          ? 'translate(14px, 14px) scale(1)'
          : 'translate(14px, 12px) scale(1)',
      
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
    
    // 入力フィールドの概要スタイル
    '& .MuiOutlinedInput-notchedOutline': {
      transition: 'border-color 0.2s ease-in-out',
    },
    
    // 無効状態のスタイル
    '& .Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    
    // ヘルプテキストのスタイル
    '& .MuiFormHelperText-root': {
      marginLeft: '4px',
      fontSize: '0.75rem',
    },
  };
});

/**
 * アクセシビリティに対応した拡張入力フィールドコンポーネント
 */
export const Input = forwardRef<HTMLDivElement, InternalInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      error,
      type = 'text',
      required = false,
      disabled = false,
      size = 'md',
      startIcon,
      endIcon,
      maxLength,
      autoComplete = 'off',
      testId,
      className,
      sx,
      ariaLabel,
      ariaDescription,
      role,
      rounded = false,
      noAnimation = false,
      customVariant = 'outlined',
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    
    // 入力参照
    const inputRef = useRef<HTMLInputElement>(null);
    
    // 入力状態
    const [inputState, setInputState] = useState<'default' | 'focus' | 'error'>('default');
    const [inputValue, setInputValue] = useState<string>(value as string);
    const [charCount, setCharCount] = useState<number>(0);
    
    // 値の変更を処理
    useEffect(() => {
      if (typeof value === 'string') {
        setInputValue(value);
        setCharCount(value.length);
      }
    }, [value]);
    
    // 入力ハンドラ
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // 最大長さのチェック
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      
      setInputValue(newValue);
      setCharCount(newValue.length);
      
      if (onChange) {
        // Adapt to both interfaces: function expecting string and ChangeEvent
        if (typeof onChange === 'function') {
          // Check if it accepts event parameter
          // Cast to any to avoid type errors
          const handler = onChange as any;
          handler(e);
        }
      }
    };
    
    // フォーカスハンドラ
    const handleFocus = () => {
      setInputState('focus');
    };
    
    // ブラーハンドラ
    const handleBlur = () => {
      setInputState(error ? 'error' : 'default');
    };
    
    // MUI互換のサイズにマッピング
    const sizeMap = {
      xs: 'small',
      sm: 'small',
      md: 'medium',
      lg: 'medium',
      xl: 'medium',
    };
    
    const muiSize = sizeMap[size as keyof typeof sizeMap] as 'small' | 'medium';
    
    // アイコンの設定
    const getInputProps = () => {
      const props: Partial<InputBaseProps> = {};
      
      if (startIcon) {
        props.startAdornment = (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        );
      }
      
      if (endIcon) {
        props.endAdornment = (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        );
      }
      
      return props;
    };
    
    // ヘルパーテキストの表示
    const renderHelperText = () => {
      // エラーがある場合
      if (error) {
        return (
          <FormHelperText 
            error 
            id={`${testId || 'input'}-error-text`}
            aria-live="assertive"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <ErrorOutlineIcon sx={{ fontSize: '0.875rem' }} />
            {error}
          </FormHelperText>
        );
      }
      
      // ヘルパーテキストがある場合
      if (helperText) {
        return (
          <FormHelperText 
            id={`${testId || 'input'}-helper-text`}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <InfoOutlinedIcon sx={{ fontSize: '0.875rem' }} />
            {helperText}
          </FormHelperText>
        );
      }
      
      // 文字数制限がある場合
      if (maxLength) {
        return (
          <FormHelperText 
            id={`${testId || 'input'}-char-count`}
            sx={{ 
              textAlign: 'right',
              color: charCount >= maxLength ? theme.palette.error.main : 'inherit'
            }}
          >
            {charCount}/{maxLength}
          </FormHelperText>
        );
      }
      
      return null;
    };

    return (
      <FormControl fullWidth error={!!error} required={required} disabled={disabled}>
        <StyledTextField
          ref={ref}
          inputRef={inputRef}
          data-testid={testId}
          type={type}
          label={label}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={!!error}
          disabled={disabled}
          required={required}
          fullWidth
          variant={customVariant}
          size={muiSize}
          autoComplete={autoComplete}
          InputProps={getInputProps()}
          className={className}
          sx={sx}
          rounded={rounded}
          customSize={size}
          noAnimation={noAnimation}
          customState={inputState}
          inputProps={{
            'aria-label': ariaLabel || label,
            'aria-describedby': ariaDescription ? `${testId}-desc` : undefined,
            role,
            maxLength: maxLength,
          }}
          {...rest}
        />
        
        {renderHelperText()}
        
        {/* アクセシビリティのための非表示説明 */}
        {ariaDescription && (
          <span id={`${testId}-desc`} style={{ display: 'none' }}>
            {ariaDescription}
          </span>
        )}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';

export default Input;