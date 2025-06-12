import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import StyledText from './StyledText'; // Assuming StyledText is in the same directory
import { theme, ColorName, SpacingName, BorderRadiusName, FontSizeName } from '../styles/theme'; // Adjust path

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  isLoading?: boolean; // Will just disable and change opacity for now
  fullWidth?: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  style,
  disabled,
  ...rest
}) => {
  const buttonStyles: ViewStyle = {};
  const textStyles: Partial<React.ComponentProps<typeof StyledText>> = {}; // For StyledText props

  // Base styles
  buttonStyles.flexDirection = 'row';
  buttonStyles.alignItems = 'center';
  buttonStyles.justifyContent = 'center';
  buttonStyles.borderRadius = theme.borders.borderRadius.md;
  buttonStyles.borderWidth = theme.borders.borderWidth.sm;
  buttonStyles.opacity = disabled || isLoading ? theme.opacity.disabled : 1;
  if (fullWidth) {
    buttonStyles.width = '100%';
  }

  // Size-specific styles
  switch (size) {
    case 'xs':
      buttonStyles.paddingHorizontal = theme.spacing.sm;
      buttonStyles.paddingVertical = theme.spacing.xs;
      textStyles.fontSize = 'xs';
      break;
    case 'sm':
      buttonStyles.paddingHorizontal = theme.spacing.md;
      buttonStyles.paddingVertical = theme.spacing.sm;
      textStyles.fontSize = 'sm';
      break;
    case 'lg':
      buttonStyles.paddingHorizontal = theme.spacing.xl;
      buttonStyles.paddingVertical = theme.spacing.lg;
      textStyles.fontSize = 'lg';
      textStyles.fontFamily = 'poppinsSemiBold'; // Example: Larger buttons might use Poppins
      break;
    case 'md': // Default
    default:
      buttonStyles.paddingHorizontal = theme.spacing.lg;
      buttonStyles.paddingVertical = theme.spacing.md;
      textStyles.fontSize = 'md';
      break;
  }

  // Variant-specific styles
  switch (variant) {
    case 'primary':
      buttonStyles.backgroundColor = theme.colors.primary;
      buttonStyles.borderColor = theme.colors.primary;
      textStyles.color = 'white';
      break;
    case 'secondary':
      buttonStyles.backgroundColor = theme.colors.secondary;
      buttonStyles.borderColor = theme.colors.secondary;
      textStyles.color = 'white';
      break;
    case 'outline':
      buttonStyles.backgroundColor = theme.colors.transparent;
      buttonStyles.borderColor = theme.colors.primary; // Outline uses primary color for border
      textStyles.color = 'primary';
      break;
    case 'ghost':
      buttonStyles.backgroundColor = theme.colors.transparent;
      buttonStyles.borderColor = theme.colors.transparent;
      textStyles.color = 'primary';
      break;
    case 'danger':
      buttonStyles.backgroundColor = theme.colors.error;
      buttonStyles.borderColor = theme.colors.error;
      textStyles.color = 'white';
      break;
  }

  // Disabled state overrides
  if (disabled || isLoading) {
    if (variant === 'primary' || variant === 'secondary' || variant === 'danger') {
      buttonStyles.backgroundColor = theme.colors.greyMedium;
      buttonStyles.borderColor = theme.colors.greyMedium;
    } else if (variant === 'outline' || variant === 'ghost') {
      textStyles.color = 'textSecondary'; // Muted text for disabled outline/ghost
    }
  }


  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {leftIcon && !isLoading && <View style={styles.iconWrapper}>{leftIcon}</View>}
      {/* Basic Loading state: could be replaced by an ActivityIndicator */}
      {isLoading && <StyledText fontSize={textStyles.fontSize} color="textSecondary">Loading...</StyledText>}
      {!isLoading && (
        <StyledText
            variant="button" // Use button variant for base text styling
            color={textStyles.color} // Override color based on button variant
            fontSize={textStyles.fontSize} // Override size based on button size
            fontFamily={textStyles.fontFamily} // Override font family
        >
          {title}
        </StyledText>
      )}
      {rightIcon && !isLoading && <View style={styles.iconWrapper}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    marginHorizontal: theme.spacing.xs,
  },
});

export default StyledButton;
