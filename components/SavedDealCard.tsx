import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import { SavedDeal } from "@/types";
import { restaurants } from "@/mocks/restaurants";

interface SavedDealCardProps {
  savedDeal: SavedDeal;
  onPress: (savedDeal: SavedDeal) => void;
}

export default function SavedDealCard({ savedDeal, onPress }: SavedDealCardProps) {
  // Find the restaurant and deal from our mock data
  const restaurant = restaurants.find(r => r.id === savedDeal.restaurantId);
  const deal = restaurant?.deals.find(d => d.id === savedDeal.dealId);
  
  if (!restaurant || !deal) {
    return null;
  }
  
  const expiryDate = new Date(savedDeal.expiresAt);
  const formattedDate = expiryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        savedDeal.isUsed && styles.usedContainer
      ]} 
      onPress={() => onPress(savedDeal)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: deal.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        
        {savedDeal.isUsed && (
          <View style={styles.usedOverlay}>
            <View style={styles.usedBadge}>
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.usedText}>REDEEMED</Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.dealTitle}>{deal.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>${deal.discountedPrice.toFixed(2)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{deal.discount}</Text>
          </View>
        </View>
        
        <View style={styles.expiryContainer}>
          <Clock size={14} color={savedDeal.isUsed ? Colors.text.light : Colors.text.secondary} />
          <Text style={[
            styles.expiryText,
            savedDeal.isUsed && styles.usedText
          ]}>
            {savedDeal.isUsed ? "Redeemed" : `Expires on ${formattedDate}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  usedContainer: {
    opacity: 0.7,
  },
  imageContainer: {
    height: 120,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  usedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  usedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  usedText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.text.light,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 18,
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
    fontSize: 12,
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});