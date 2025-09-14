// app/(tabs)/edit-profile.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import Colors from "@/constants/colors";

export default function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!firstName || !lastName || !email) return;

    setUser({ ...user!, firstName, lastName, email, imageUrl });
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <Text style={styles.imageText}>Pick Profile Image</Text>
        )}
      </TouchableOpacity>

      <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />

      <Button title="Save" onPress={handleSave} fullWidth style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 20,
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 75,
    width: 120,
    height: 120,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  imageText: {
    color: "#999",
    fontSize: 14,
  },
});
