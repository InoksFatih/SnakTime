import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Clock, Info, Star } from "lucide-react-native";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { useDealsStore } from "@/store/dealsStore";
import { Deal, Restaurant } from "@/types";
import { formatTime, isTimeInRange, getCurrentTime, getTimeRemaining } from "@/utils/time";
import { generateQRCode } from "@/utils/qrCode";

export default function DealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  
  const addSavedDeal = useDealsStore((state) => state.addSavedDeal);
  const savedDeals = useDealsStore((state) => state.savedDeals);
  const insets = useSafeAreaInsets(); 
  // Find the deal and restaurant
 useEffect(() => {
  if (id) {
    for (const r of restaurants) {
      const foundDeal = r.deals.find((d) => d.id === id);
      if (foundDeal) {
        setDeal(foundDeal);
        setRestaurant(r);
        break;
      }
    }
  }
}, [id]);
  
  // Check if the deal is already saved
  const isDealSaved = savedDeals.some(
    (savedDeal) => savedDeal.dealId === id && !savedDeal.isUsed
  );
  
  const currentTime = getCurrentTime();
  const isActive = deal ? isTimeInRange(currentTime, deal.startTime, deal.endTime) : false;
  
  const handleSaveDeal = async () => {
    if (!deal || !restaurant) return;
    
    // If the deal is not active, show an alert
    if (!isActive) {
      if (Platform.OS === "web") {
        alert("This deal is not currently active. Please come back during the deal hours.");
      } else {
        Alert.alert(
          "Deal Not Active",
          "This deal is not currently active. Please come back during the deal hours.",
          [{ text: "OK" }]
        );
      }
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would send a request to the backend
      // For this demo, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate a QR code
      const qrCode = generateQRCode(deal.id, "user123");
      
      // Calculate expiry time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create a saved deal object
      const savedDeal = {
        id: Math.random().toString(36).substring(2, 15),
        dealId: deal.id,
        restaurantId: restaurant.id,
        qrCode,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isUsed: false,
      };
      
      // Add the saved deal to the store
      addSavedDeal(savedDeal);
      
      // Provide haptic feedback on success
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to the QR code screen
      router.push(`/qrcode/${savedDeal.id}`);
    } catch (error) {
      console.error("Error saving deal:", error);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!deal || !restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading deal details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: restaurant.name,
        }}
      />
      
      <ScrollView
  contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]} // ensures space for button
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: deal.image }}
            style={styles.image}
            contentFit="cover"
          />
          
          <View style={[
            styles.statusBadge,
            isActive ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={styles.statusText}>
              {isActive ? "Active Now" : "Coming Soon"}
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.description}>{deal.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
            <Text style={styles.discountedPrice}>${deal.discountedPrice.toFixed(2)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{deal.discount}</Text>
            </View>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={18} color={Colors.text.secondary} />
            <Text style={styles.timeText}>
              Available from {formatTime(deal.startTime)} to {formatTime(deal.endTime)}
            </Text>
          </View>
          
          {isActive && (
            <View style={styles.remainingContainer}>
              <Text style={styles.remainingText}>
                Ends in {getTimeRemaining(deal.endTime)}
              </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.restaurantContainer}>
            <Image
              source={{ uri: restaurant.image }}
              style={styles.restaurantImage}
              contentFit="cover"
            />
            
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
              
              <View style={styles.restaurantRating}>
                <Star size={16} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
                <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Info size={18} color={Colors.primary} />
              <Text style={styles.infoTitle}>How to use this deal</Text>
            </View>
            
            <Text style={styles.infoText}>
              1. Save this deal to generate a unique QR code
            </Text>
            <Text style={styles.infoText}>
              2. Show the QR code to the restaurant staff when ordering
            </Text>
            <Text style={styles.infoText}>
              3. Enjoy your discounted meal!
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
  {isDealSaved ? (
    <TouchableOpacity
    activeOpacity={0.8}
      style={styles.viewDealButton}
      onPress={() => {
        const savedDeal = savedDeals.find(
          (sd) => sd.dealId === id && !sd.isUsed
        );
        if (savedDeal) {
          router.push(`/qrcode/${savedDeal.id}`);
        }
      }}
    >
      <Text style={styles.viewDealText}>View Saved Deal</Text>
    </TouchableOpacity>
  ) : (
    <Button
      title={isActive ? "Save Deal" : "Deal Not Active"}
      onPress={handleSaveDeal}
      disabled={!isActive || loading}
      loading={loading}
      fullWidth
    />
  )}
</View>

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
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  inactiveBadge: {
    backgroundColor: Colors.text.light,
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.text.light,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  footer: {
  paddingHorizontal: 24,
  paddingTop: 24,
},

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  remainingContainer: {
    marginBottom: 16,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },
  restaurantContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  restaurantRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoContainer: {
    backgroundColor: `${Colors.primary}10`,
    padding: 16,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
 
  viewDealButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  viewDealText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});