import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Camera, User, Phone, UserCheck } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission d'accès aux médias requise !");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Veuillez saisir votre nom");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phoneNumber.trim()) {
      setPhoneError("Veuillez saisir votre numéro de téléphone");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleComplete = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const userId = currentUser?.id || Date.now();
      const email = currentUser?.email || "";

      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ");

      const updatedUser = {
        id: userId,
        email,
        role: currentUser?.role || "USER",
        phoneNumber: phoneNumber,
        firstName,
        lastName,
        imageUrl: avatar || "",
      };

      await AsyncStorage.setItem("auth_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving profile:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
                <UserCheck size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>Snak Time</Text>
            </View>
            <Text style={styles.welcomeText}>Complétez votre profil</Text>
            <Text style={styles.subtitleText}>
              Ajoutez vos informations pour obtenir des recommandations personnalisées
            </Text>
          </View>

          {/* Profile Form Card */}
          <BlurView intensity={20} tint="light" style={styles.formCard}>
            <View style={styles.form}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <TouchableOpacity
                  style={styles.avatarButton}
                  onPress={handleSelectImage}
                  activeOpacity={0.8}
                >
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Camera size={32} color="#6B7280" />
                    </View>
                  )}
                  <View style={styles.avatarBadge}>
                    <Camera size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarText}>Ajouter une photo de profil</Text>
              </View>

              {/* Form Inputs */}
              <View style={styles.inputSection}>
                <Input
                  placeholder="Nom complet"
                  value={name}
                  onChangeText={setName}
                  leftIcon={<User size={22} color="#6B7280" />}
                />
                {nameError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {nameError}</Text>
                  </View>
                ) : null}

                <Input
                  placeholder="Numéro de téléphone"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  leftIcon={<Phone size={22} color="#6B7280" />}
                />
                {phoneError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {phoneError}</Text>
                  </View>
                ) : null}
              </View>

              <Button
                title="TERMINER LA CONFIGURATION"
                onPress={handleComplete}
                loading={loading}
                fullWidth
                style={styles.completeButton}
              />

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  En continuant, vous acceptez nos{" "}
                  <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{" "}
                  <Text style={styles.termsLink}>Politique de confidentialité</Text>
                </Text>
              </View>
            </View>
          </BlurView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.skipContainer}
            >
              <Text style={styles.skipText}>
                <Text style={styles.skipLink}>Ignorer pour l'instant</Text>
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
    width: 160,
    height: 160,
    top: -80,
    right: -80,
  },
  circle2: {
    width: 120,
    height: 120,
    top: height * 0.25,
    left: -60,
  },
  circle3: {
    width: 140,
    height: 140,
    top: height * 0.6,
    right: -70,
  },
  circle4: {
    width: 90,
    height: 90,
    bottom: 120,
    left: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    minHeight: height - 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
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
  avatarSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "relative",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  inputSection: {
    gap: 8,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    marginTop: -12,
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "500",
  },
  completeButton: {
    marginTop: 8,
    backgroundColor: "#4f46e5",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  termsContainer: {
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#6366f1",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  bottomSection: {
    alignItems: "center",
  },
  skipContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  skipText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  skipLink: {
    color: "#60a5fa",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});