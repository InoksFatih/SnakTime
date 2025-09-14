import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Mail, Lock, UserPlus, Check } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { saveUserToJsonFile } from "@/utils/saveToFile";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const setToken = useAuthStore((state) => state.setToken);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("Tous les champs sont requis");
      return false;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez saisir un email valide");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.find((u: any) => u.email === email)) {
        throw new Error("Cette adresse email est déjà utilisée");
      }

      const newUser = {
        email,
        password,
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await saveUserToJsonFile(email, password);

      setToken("static-token-123");

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.replace("/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Échec de l'inscription");

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: "" };

    let strength = 0;
    let text = "Faible";
    let color = "#ef4444";

    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;

    if (strength >= 3) {
      text = "Moyen";
      color = "#f59e0b";
    }
    if (strength >= 4) {
      text = "Fort";
      color = "#10b981";
    }

    return { strength: (strength / 5) * 100, text, color };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#7c3aed', '#2563eb', '#06b6d4', '#10b981']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated background elements */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <UserPlus size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>Snak Time</Text>
            </View>
            <Text style={styles.welcomeText}>Créez votre compte</Text>
            <Text style={styles.subtitleText}>
              Rejoignez des milliers d'utilisateurs et commencez à économiser
            </Text>
          </View>

          {/* Registration Form Card */}
          <BlurView intensity={20} tint="light" style={styles.formCard}>
            <View style={styles.form}>
              <Input
                placeholder="Adresse email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={22} color="#6B7280" />}
              />

              <Input
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={22} color="#6B7280" />}
              />

              {/* Password strength meter */}
              {password ? (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    <View
                      style={[
                        styles.passwordStrengthFill,
                        {
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.text}
                  </Text>
                </View>
              ) : null}

              <Input
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Lock size={22} color="#6B7280" />}
                rightIcon={
                  confirmPassword && password === confirmPassword ? (
                    <Check size={22} color="#10b981" />
                  ) : null
                }
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              ) : null}

              <Button
                title="CRÉER MON COMPTE"
                onPress={handleRegister}
                loading={loading}
                fullWidth
                style={styles.registerButton}
              />

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  En créant un compte, vous acceptez nos{" "}
                  <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{" "}
                  <Text style={styles.termsLink}>Politique de confidentialité</Text>
                </Text>
              </View>
            </View>
          </BlurView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/Login")}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>
                Vous avez déjà un compte ?{" "}
                <Text style={styles.loginLink}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  circle: { position: "absolute", borderRadius: 1000, backgroundColor: "rgba(255, 255, 255, 0.08)" },
  circle1: { width: 180, height: 180, top: -90, right: -90 },
  circle2: { width: 120, height: 120, top: height * 0.25, left: -60 },
  circle3: { width: 200, height: 200, top: height * 0.6, right: -100 },
  circle4: { width: 80, height: 80, bottom: 150, left: 30 },
  keyboardView: { flex: 1 },
  content: { flexGrow: 1, padding: 24, justifyContent: "center", minHeight: height - 50 },
  header: { alignItems: "center", marginBottom: 32 },
  logoContainer: { alignItems: "center", marginBottom: 16 },
  logoWrapper: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 16, borderWidth: 2, borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 12,
  },
  brandName: {
    fontSize: 32, fontWeight: "800", color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4, letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 24, fontWeight: "700", color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4, marginBottom: 8,
  },
  subtitleText: { fontSize: 15, color: "rgba(255, 255, 255, 0.8)", textAlign: "center", lineHeight: 22, paddingHorizontal: 20 },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24, padding: 28, marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25, shadowRadius: 25, elevation: 20,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)",
  },
  form: { gap: 18 },
  passwordStrengthContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  passwordStrengthBar: { flex: 1, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2, overflow: "hidden" },
  passwordStrengthFill: { height: "100%", borderRadius: 2 },
  passwordStrengthText: { fontSize: 12, fontWeight: "600", minWidth: 50 },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "500",
  },
  registerButton: {
    marginTop: 8,
    backgroundColor: "#4f46e5",  // 🔵 same blue as Login
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  termsContainer: { marginTop: 4 },
  termsText: { fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 18 },
  termsLink: { color: "#6366f1", fontWeight: "600", textDecorationLine: "underline" },
  bottomSection: { alignItems: "center" },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 20, width: "100%" },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255, 255, 255, 0.3)" },
  dividerText: { fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginHorizontal: 16, fontWeight: "500" },
  loginContainer: { padding: 16, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.1)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" },
  loginText: { fontSize: 16, color: "rgba(255, 255, 255, 0.9)", textAlign: "center", lineHeight: 20 },
  loginLink: { color: "#60a5fa", fontWeight: "700", textDecorationLine: "underline" },
});
