import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import QRCodeDisplay from "@/components/QRcodeDisplay";
import Button from "../../components/ui/Button"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useDealsStore } from "@/store/dealsStore";
import { SavedDeal } from "@/types";

export default function QRCodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [savedDeal, setSavedDeal] = useState<SavedDeal | null>(null);
  const [loading, setLoading] = useState(false);
  
  const savedDeals = useDealsStore((state) => state.savedDeals);
  const markDealAsUsed = useDealsStore((state) => state.markDealAsUsed);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (id) {
      const foundDeal = savedDeals.find((deal) => deal.id === id);
      if (foundDeal) {
        setSavedDeal(foundDeal);
      }
    }
  }, [id, savedDeals]);
  
  const handleMarkAsUsed = () => {
    if (!savedDeal) return;
    
    // Show confirmation dialog
    if (Platform.OS === "web") {
      if (confirm("Mark this deal as redeemed? This action cannot be undone.")) {
        performMarkAsUsed();
      }
    } else {
      Alert.alert(
        "Mark as Redeemed",
        "Are you sure you want to mark this deal as redeemed? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: performMarkAsUsed,
          },
        ],
        { cancelable: true }
      );
    }
  };
  
  const performMarkAsUsed = async () => {
    if (!savedDeal) return;
    
    setLoading(true);
    
    try {
      // In a real app, this would send a request to the backend
      // For this demo, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mark the deal as used
      markDealAsUsed(savedDeal.id);
      
      // Provide haptic feedback on success
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate back to the deals screen
      router.replace("/(tabs)/deals");
    } catch (error) {
      console.error("Error marking deal as used:", error);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!savedDeal) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading QR code...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "QR Code",
          presentation: "modal",
        }}
      />
      
      <QRCodeDisplay savedDeal={savedDeal} />
      
      {!savedDeal.isUsed && (
        <View
  style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: insets.bottom + 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  }}
>
  <Button
    title="Mark as Redeemed"
    onPress={handleMarkAsUsed}
    loading={loading}
    fullWidth
    leftIcon={<Check size={20} color="#FFFFFF" />}
  />
</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});