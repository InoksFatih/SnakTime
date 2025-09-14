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
import { Mail, Lock } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez saisir votre email et mot de passe");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Identifiants invalides");
      }

      setToken("static-token-123");
      setUser(user);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Login error:", err);
      setError("Identifiants invalides. Veuillez réessayer.");

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#8b5cf6', '#ec4899']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated background circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

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
                <Text style={styles.logoEmoji}>🍽️</Text>
              </View>
              <Text style={styles.brandName}>Snak Time</Text>
            </View>
            <Text style={styles.welcomeText}>Bon retour parmi nous</Text>
            <Text style={styles.subtitleText}>
              Connectez-vous pour découvrir les meilleures offres
            </Text>
          </View>

          {/* Login Form Card */}
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

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <Button
                title="SE CONNECTER"
                onPress={handleLogin}
                loading={loading}
                fullWidth
                style={styles.loginButton}
              />
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
              onPress={() => router.push("/Register")}
              style={styles.signupContainer}
            >
              <Text style={styles.signupText}>
                Pas encore de compte ?{" "}
                <Text style={styles.signupLink}>Créer un compte</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 100,
    right: 50,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    minHeight: height - 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
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
  forgotButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  forgotText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#4f46e5",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  bottomSection: {
    alignItems: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginHorizontal: 16,
    fontWeight: "500",
  },
  signupContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  signupText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  signupLink: {
    color: "#60a5fa",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});