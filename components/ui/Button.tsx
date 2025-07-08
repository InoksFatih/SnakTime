import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case "primary":
        buttonStyle = styles.primary;
        break;
      case "secondary":
        buttonStyle = styles.secondary;
        break;
      case "outline":
        buttonStyle = styles.outline;
        break;
      case "text":
        buttonStyle = styles.text;
        break;
    }
    
    // Size styles
    switch (size) {
      case "small":
        buttonStyle = { ...buttonStyle, ...styles.small };
        break;
      case "medium":
        buttonStyle = { ...buttonStyle, ...styles.medium };
        break;
      case "large":
        buttonStyle = { ...buttonStyle, ...styles.large };
        break;
    }
    
    // Full width
    if (fullWidth) {
      buttonStyle = { ...buttonStyle, ...styles.fullWidth };
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabled };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleVar: TextStyle = {};
    
    switch (variant) {
      case "primary":
        textStyleVar = styles.primaryText;
        break;
      case "secondary":
        textStyleVar = styles.secondaryText;
        break;
      case "outline":
        textStyleVar = styles.outlineText;
        break;
      case "text":
        textStyleVar = styles.textText;
        break;
    }
    
    switch (size) {
      case "small":
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case "medium":
        textStyleVar = { ...textStyleVar, ...styles.mediumText };
        break;
      case "large":
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
    }
    
    if (disabled) {
      textStyleVar = { ...textStyleVar, ...styles.disabledText };
    }
    
    return textStyleVar;
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "outline" || variant === "text" ? Colors.primary : "#FFFFFF"} 
          size="small" 
        />
      ) : (
        <View style={styles.buttonContent}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    backgroundColor: "transparent",
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Text styles
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  textText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  
  // Width
  fullWidth: {
    width: "100%",
  },
});