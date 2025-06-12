export const colors = {
  primary: '#8B5CF6',       // Edugram Purple
  secondary: '#10B981',     // Green
  accent: '#F59E0B',        // Orange/Yellow
  backgroundMain: '#000000', // Black
  backgroundSurface: '#111111', // Very Dark Gray (cards, modals)
  backgroundElevated: '#1a1a1a', // Dark Gray (inputs, some buttons)
  border: '#333333',         // Medium Gray
  textPrimary: '#FFFFFF',    // White
  textSecondary: '#CCCCCC',  // Light Gray
  textMuted: '#888888',      // Gray
  textDisabled: '#666666',   // Darker Gray
  error: '#EF4444',          // Red
  success: '#10B981',       // Green (same as secondary for now)
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  fontFamilyPrimary: 'Inter',    // For body text, labels, general UI
  fontFamilyHeadings: 'Poppins', // For screen titles, major headings

  fontWeights: {
    regular: '400' as '400', // Cast to specific literal types for better type checking if needed
    medium: '500' as '500',
    semiBold: '600' as '600',
    bold: '700' as '700',
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,     // base body size
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
};

export const spacing = {
  space_xs: 4,
  space_sm: 8,
  space_md: 12,
  space_lg: 16,
  space_xl: 20,
  space_xxl: 24,
  space_xxxl: 32,
};

export const radii = {
  radius_sm: 8,
  radius_md: 12,    // standard for inputs, smaller cards
  radius_lg: 16,    // standard for larger cards, buttons
  radius_xl: 20,    // for modals, some buttons
  radius_full: 999, // for circular elements
};

export const theme = {
  colors,
  typography,
  spacing,
  radii,
};

// Helper function to combine fontFamily and fontWeight for StyleSheet
// This is a common pattern if your font loading uses specific names like 'Inter-Bold'
// For this subtask, we'll assume direct use of fontFamily and fontWeight props in StyleSheet
// and that React Native's font selection mechanism handles it based on loaded fonts.
// If not, this helper would be more complex or font names in theme.ts would be more specific.
// export const getFontStyles = (
//   family: 'Inter' | 'Poppins',
//   weight: '400' | '500' | '600' | '700',
//   size: number
// ) => {
//   let fontFamily = '';
//   if (family === 'Inter') {
//     if (weight === '400') fontFamily = 'Inter-Regular';
//     else if (weight === '500') fontFamily = 'Inter-Medium';
//     else if (weight === '600') fontFamily = 'Inter-SemiBold';
//     else if (weight === '700') fontFamily = 'Inter-Bold';
//   } else if (family === 'Poppins') {
//     if (weight === '400') fontFamily = 'Poppins-Regular';
//     // ... and so on for Poppins
//   }
//   return { fontFamily, fontSize: size, fontWeight: weight }; // fontWeight might be redundant if fontFamily implies it
// };

export default theme;
