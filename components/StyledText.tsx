import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { theme, ColorName, FontSizeName, FontWeightName, LineHeightName, FontName } from '../styles/theme'; // Adjust path as necessary

interface StyledTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button' | 'small'; // Predefined variants
  fontSize?: FontSizeName; // Override specific font size from theme
  fontWeight?: FontWeightName; // Override specific font weight
  fontFamily?: FontName; // Override specific font family
  color?: ColorName; // Use color name from theme
  lineHeight?: LineHeightName; // Override line height
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  style?: TextProps['style'];
}

const StyledText: React.FC<StyledTextProps> = ({
  children,
  variant = 'body',
  fontSize: fontSizeProp,
  fontWeight: fontWeightProp,
  fontFamily: fontFamilyProp,
  color = 'text',
  lineHeight: lineHeightProp,
  textAlign,
  style,
  ...rest
}) => {
  const getFontFamily = (baseFont: FontName = 'inter', weight: FontWeightName = 'regular'): string => {
    const base = theme.typography.fonts[baseFont] || theme.typography.fonts.inter;
    // This is a simplified example. A more robust solution would map abstract weights to specific font files.
    // E.g. 'Inter-Bold' for fontWeight 'bold' when baseFont is 'inter'.
    // For now, we directly use the font family string from theme.typography.fonts if specific,
    // or fall back to the base font family if only an abstract weight is given.
    if (fontFamilyProp) return theme.typography.fonts[fontFamilyProp] || base;

    // Map abstract weights to specific font files (assuming they are loaded with these names)
    if (baseFont === 'inter') {
        if (weight === 'bold') return theme.typography.fonts.interBold;
        if (weight === 'semiBold') return theme.typography.fonts.interSemiBold;
        if (weight === 'medium') return theme.typography.fonts.interMedium;
        return theme.typography.fonts.interRegular;
    }
    if (baseFont === 'poppins') {
        if (weight === 'bold') return theme.typography.fonts.poppinsBold;
        if (weight === 'semiBold') return theme.typography.fonts.poppinsSemiBold;
        if (weight === 'medium') return theme.typography.fonts.poppinsMedium;
        return theme.typography.fonts.poppinsRegular;
    }
    return base;
  };

  const stylesFromProps = StyleSheet.create({
    text: {
      color: theme.colors[color] || theme.colors.text,
      fontFamily: getFontFamily(fontFamilyProp, fontWeightProp), // Default to inter, allow override
      fontSize: fontSizeProp ? theme.typography.fontSizes[fontSizeProp] : undefined,
      // fontWeight needs to be handled by the font family string itself in React Native (e.g., 'Inter-Bold')
      // The abstract fontWeightProp is used by getFontFamily to select the correct font string.
      lineHeight: lineHeightProp ? theme.typography.fontSizes[fontSizeProp || 'md'] * theme.typography.lineHeights[lineHeightProp] : undefined,
      textAlign: textAlign || undefined,
    },
  });

  const variantStyle: TextProps['style'] = {};
  switch (variant) {
    case 'h1':
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('poppins', 'bold'),
        fontSize: theme.typography.fontSizes.h1,
        lineHeight: theme.typography.fontSizes.h1 * theme.typography.lineHeights.display,
      });
      break;
    case 'h2':
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('poppins', 'bold'),
        fontSize: theme.typography.fontSizes.h2,
        lineHeight: theme.typography.fontSizes.h2 * theme.typography.lineHeights.display,
      });
      break;
    case 'h3':
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('poppins', 'semiBold'),
        fontSize: theme.typography.fontSizes.h3,
        lineHeight: theme.typography.fontSizes.h3 * theme.typography.lineHeights.tight,
      });
      break;
    case 'body': // Default
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('inter', fontWeightProp || 'regular'),
        fontSize: theme.typography.fontSizes.md,
        lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.normal,
      });
      break;
    case 'caption':
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('inter', fontWeightProp || 'regular'),
        fontSize: theme.typography.fontSizes.sm,
        lineHeight: theme.typography.fontSizes.sm * theme.typography.lineHeights.normal,
        color: theme.colors.textSecondary,
      });
      break;
    case 'small':
      Object.assign(variantStyle, {
        fontFamily: getFontFamily('inter', fontWeightProp || 'regular'),
        fontSize: theme.typography.fontSizes.xs,
        lineHeight: theme.typography.fontSizes.xs * theme.typography.lineHeights.normal,
      });
      break;
    case 'button':
       Object.assign(variantStyle, {
        fontFamily: getFontFamily('inter', 'semiBold'), // Default button text style
        fontSize: theme.typography.fontSizes.md,
        lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.normal,
      });
      break;
  }

  // If specific props are given, they override variant styles
  if (fontSizeProp) variantStyle.fontSize = theme.typography.fontSizes[fontSizeProp];
  if (lineHeightProp && variantStyle.fontSize) { // Ensure fontSize is available for calculation
    variantStyle.lineHeight = (variantStyle.fontSize as number) * theme.typography.lineHeights[lineHeightProp];
  }
  if (fontFamilyProp || fontWeightProp) { // If specific font/weight is requested, override variant's default family
      variantStyle.fontFamily = getFontFamily(fontFamilyProp, fontWeightProp);
  }
   if (color) { // Allow color prop to always override variant's default color (e.g. caption)
    variantStyle.color = theme.colors[color] || theme.colors.text;
  }


  return (
    <Text style={[stylesFromProps.text, variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

export default StyledText;
