import { TextStyle } from 'react-native';

const lightColors = {
  primary: '#7C3AED', // Modern mor
  primaryLight: '#8B5CF6',
  primaryDark: '#6D28D9',
  secondary: '#10B981', // Modern green
  background: '#F9FAFB',
  surface: '#FFFFFF',
  error: '#EF4444',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF'
  },
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB'
  }
};

const darkColors = {
  primary: '#8B5CF6',
  primaryLight: '#7C3AED',
  primaryDark: '#6D28D9',
  secondary: '#10B981',
  background: '#111827',
  surface: '#1F2937',
  error: '#EF4444',
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    disabled: '#6B7280',
    inverse: '#1F2937'
  },
  border: {
    light: '#374151',
    default: '#4B5563'
  }
};

export type Theme = 'light' | 'dark';

export const getColors = (theme: Theme) => {
  return theme === 'light' ? lightColors : darkColors;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 5,
  }
};

type FontWeight = '400' | '500' | '600' | '700';

export const typography: { [key: string]: TextStyle } = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as FontWeight,
    lineHeight: 40
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as FontWeight,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as FontWeight,
    lineHeight: 28
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as FontWeight,
    lineHeight: 24
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as FontWeight,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as FontWeight,
    lineHeight: 16
  }
}; 