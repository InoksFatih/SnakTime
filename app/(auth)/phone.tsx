import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Phone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setStorePhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const setVerificationId = useAuthStore((state) => state.setVerificationId);
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    // Simple phone number format validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // In a real app, this would send an OTP to the phone number
      // For this demo, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Provide haptic feedback on success
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Store the phone number in our auth store
      setStorePhoneNumber(phoneNumber);
      
      // Generate a fake verification ID
      const fakeVerificationId = Math.random().toString(36).substring(2, 15);
      setVerificationId(fakeVerificationId);
      
      // Navigate to verification screen
      router.push("/verify");
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("Failed to send verification code. Please try again.");
      
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
      <ScrollView
  contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>

        <View style={styles.header}>
          <Text style={styles.title}>Enter your phone number</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code to confirm your identity
          </Text>
        </View>
        
        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoFocus
          error={error}
          leftIcon={<Phone size={20} color={Colors.text.secondary} />}
        />
        
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            fullWidth
          />
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
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
  footer: {
    marginTop: 24,
  },
  termsText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: "center",
    marginTop: 16,
  },
});