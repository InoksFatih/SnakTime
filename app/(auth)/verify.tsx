import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const insets = useSafeAreaInsets();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const setIsVerified = useAuthStore((state) => state.setIsVerified);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCodeChange = (text: string, index: number) => {
    // Update the code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Auto-focus next input if current input is filled
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendCode = async () => {
    if (timer > 0) return;
    
    // In a real app, this would resend the OTP
    setTimer(60);
    
    // Provide haptic feedback
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleVerify = async () => {
    // Check if code is complete
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      setError("Please enter the complete verification code");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      // In a real app, this would verify the OTP with a backend
      // For this demo, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For demo purposes, any 4-digit code is valid
      
      // Provide haptic feedback on success
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Mark as verified in our auth store
      setIsVerified(true);
      
      // Navigate to profile setup
      router.push("/profile");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Invalid verification code. Please try again.");
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 4-digit code to {phoneNumber}
          </Text>
        </View>
        
        <View style={styles.codeContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => {inputRefs.current[index] = ref;}}
              style={styles.codeInput}
              value={code[index]}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0}
          style={styles.resendContainer}
        >
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
            Resend Code {timer > 0 ? `(${timer}s)` : ""}
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
  <Button
    title="Verify"
    onPress={handleVerify}
    loading={loading}
    fullWidth
  />
</View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  codeInput: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  resendDisabled: {
    color: Colors.text.light,
  },
  footer: {
    marginTop: "auto",
  },
});