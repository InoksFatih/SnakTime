import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  User,
  Settings,
  Bell,
  MapPin,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to log out?")) {
        performLogout();
      }
    } else {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log Out", style: "destructive", onPress: performLogout },
        ],
        { cancelable: true }
      );
    }
  };

  const performLogout = async () => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    await logout(); // ✅ must await since it's async now
    router.replace("/(auth)");
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleLocation = () => {
    setLocationEnabled(!locationEnabled);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found. Please log in again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={Colors.text.light} />
            </View>
          )}

          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.email}>{user.email || user.phoneNumber}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.settingsContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingItem}
            onPress={() => router.push("/edit-profile")}
>
            <View style={styles.settingIcon}>
              <User size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts about new deals
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.text.light, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Location Services</Text>
              <Text style={styles.settingDescription}>
                Allow access to your location
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={toggleLocation}
              trackColor={{ false: Colors.text.light, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.settingsContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Settings size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Terms & Privacy</Text>
            </View>
            <ChevronRight size={20} color={Colors.text.light} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
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
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: `${Colors.error}10`,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
    marginTop: 24,
  },
});
