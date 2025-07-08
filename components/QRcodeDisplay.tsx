import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { SavedDeal } from "@/types";
import { restaurants } from "@/mocks/restaurants";

interface QRCodeDisplayProps {
  savedDeal: SavedDeal;
}

export default function QRCodeDisplay({ savedDeal }: QRCodeDisplayProps) {
  // Find the restaurant and deal from our mock data
  const restaurant = restaurants.find(r => r.id === savedDeal.restaurantId);
  const deal = restaurant?.deals.find(d => d.id === savedDeal.dealId);
  
  if (!restaurant || !deal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Deal information not found</Text>
      </View>
    );
  }
  
  // Format expiry date
  const expiryDate = new Date(savedDeal.expiresAt);
  const formattedDate = expiryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const formattedTime = expiryDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  
  // Generate a placeholder QR code image URL
  // In a real app, this would be a real QR code generated from the savedDeal.qrCode
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(savedDeal.qrCode);
  
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <Image
          source={{ uri: qrCodeUrl }}
          style={styles.qrCode}
          contentFit="contain"
        />
      </View>
      
      <View style={styles.dealInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.dealTitle}>{deal.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>${deal.discountedPrice.toFixed(2)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{deal.discount}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to redeem</Text>
        <Text style={styles.instructionsText}>
          Show this QR code to the restaurant staff when ordering to redeem your discount.
        </Text>
      </View>
      
      <View style={styles.expiryContainer}>
        <Text style={styles.expiryTitle}>Expires on</Text>
        <Text style={styles.expiryDate}>{formattedDate}</Text>
        <Text style={styles.expiryTime}>at {formattedTime}</Text>
      </View>
      
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Confirmation Code</Text>
        <Text style={styles.codeValue}>{savedDeal.qrCode.substring(0, 12).toUpperCase()}</Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const QR_SIZE = width * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  qrContainer: {
    width: QR_SIZE,
    height: QR_SIZE,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  qrCode: {
    width: "100%",
    height: "100%",
  },
  dealInfo: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  restaurantName: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.text.light,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 20,
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
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 24,
  },
  instructionsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  expiryContainer: {
    width: "100%",
    marginBottom: 24,
  },
  expiryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2,
  },
  expiryTime: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  codeContainer: {
    width: "100%",
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
  },
});