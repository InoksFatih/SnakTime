import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Camera, User, Mail } from "lucide-react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const setUser = useAuthStore((state) => state.setUser);
  
  const handleSelectImage = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        
        // Provide haptic feedback
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  
  const validateInputs = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Please enter your name");
      isValid = false;
    } else {
      setNameError("");
    }
    
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    return isValid;
  };
  
  const handleComplete = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would send the profile data to a backend
      // For this demo, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Create a user object
      const user = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        email: email || "",
        phone: phoneNumber,
        avatar: avatar || undefined,
      };
      
      // Store the user in our auth store
      setUser(user);
      
      // Provide haptic feedback on success
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to the main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing profile:", error);
      
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Add your details to get personalized recommendations
            </Text>
          </View>
          
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={handleSelectImage}
              activeOpacity={0.8}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Camera size={32} color={Colors.text.light} />
                </View>
              )}
              
              <View style={styles.avatarBadge}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.avatarText}>Add Profile Photo</Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={nameError}
              leftIcon={<User size={20} color={Colors.text.secondary} />}
            />
            
            <Input
              label="Email (Optional)"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              leftIcon={<Mail size={20} color={Colors.text.secondary} />}
            />
          </View>
          
          <View style={styles.footer}>
            <Button
              title="Complete Setup"
              onPress={handleComplete}
              loading={loading}
              fullWidth
            />
            
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "relative",
    marginBottom: 8,
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
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  avatarText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: 32,
  },
  footer: {
    marginTop: "auto",
  },
  termsText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: "center",
    marginTop: 16,
  },
});