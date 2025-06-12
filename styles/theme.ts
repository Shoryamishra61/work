import { Platform } from 'react-native';

const palette = {
  // Primary Palette
  purpleDark: '#4A0E6F', // Darker Purple for primary actions
  purpleMain: '#6A1B9A', // Main Purple (example from prompt)
  purpleLight: '#8E24AA', // Lighter Purple for hover/gradients

  // Accent Palette
  tealDark: '#006978',
  tealMain: '#00ACC1', // Teal accent (example from prompt)
  tealLight: '#00BCD4',

  // Neutral Palette
  black: '#000000',
  greyDarkest: '#121212', // Dark background
  greyDarker: '#1E1E1E',  // Card background
  greyDark: '#333333',    // Border color
  greyMedium: '#666666',
  greyLight: '#B0B0B0',   // Secondary text
  white: '#FFFFFF',       // Primary text

  // Semantic Colors
  green: '#4CAF50',
  red: '#F44336',
  orange: '#FF9800',
};

export const theme = {
  colors: {
    primary: palette.purpleMain,
    primaryDark: palette.purpleDark,
    secondary: palette.tealMain,
    background: palette.greyDarkest,
    card: palette.greyDarker,
    text: palette.white,
    textSecondary: palette.greyLight,
    border: palette.greyDark,
    success: palette.green,
    error: palette.red,
    warning: palette.orange,
    white: palette.white,
    black: palette.black,
    transparent: 'transparent',
  },
  typography: {
    fonts: {
      inter: Platform.select({ web: 'Inter, sans-serif', default: 'Inter-Regular' }),
      poppins: Platform.select({ web: 'Poppins, sans-serif', default: 'Poppins-Regular' }),
      // Specific weights (assuming they are loaded as such in RootLayout)
      interRegular: 'Inter-Regular',
      interMedium: 'Inter-Medium',
      interSemiBold: 'Inter-SemiBold',
      interBold: 'Inter-Bold',
      poppinsRegular: 'Poppins-Regular',
      poppinsMedium: 'Poppins-Medium',
      poppinsSemiBold: 'Poppins-SemiBold',
      poppinsBold: 'Poppins-Bold',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      // Semantic heading sizes
      h3: 24,
      h2: 28,
      h1: 32,
      display: 48,
    },
    fontWeights: { // Abstracted weights, map to specific font families in components if needed
      regular: '400', // Standard web weight name
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5, // Default for body text
      loose: 1.75,
      display: 1.1, // For large headings
    },
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borders: {
    borderRadius: {
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      pill: 9999,
      round: Platform.OS === 'web' ? '50%' : 5000, // For circular items
    },
    borderWidth: {
      xs: 0.5,
      sm: 1,
      md: 2,
      lg: 3,
    },
  },
  opacity: {
    disabled: 0.5,
  },
  shadows: { // Example shadows - may need platform-specific adjustments
    sm: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
export type ColorName = keyof Theme['colors'];
export type FontName = keyof Theme['typography']['fonts'];
export type FontSizeName = keyof Theme['typography']['fontSizes'];
export type FontWeightName = keyof Theme['typography']['fontWeights'];
export type LineHeightName = keyof Theme['typography']['lineHeights'];
export type SpacingName = keyof Theme['spacing'];
export type BorderRadiusName = keyof Theme['borders']['borderRadius'];
export type BorderWidthName = keyof Theme['borders']['borderWidth'];

export default theme;
