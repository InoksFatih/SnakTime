import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import Colors from "@/constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  placeholder,
  value,
  onChangeText,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF" // faded gray
          value={value}
          onChangeText={onChangeText}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.text.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
});
