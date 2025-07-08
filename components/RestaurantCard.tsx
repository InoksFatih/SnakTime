import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { MapPin, Star, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { Restaurant } from "@/types";
import { formatTime, isTimeInRange, getCurrentTime } from "@/utils/time";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
  style?: any;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export default function RestaurantCard({ restaurant, onPress, style }: RestaurantCardProps) {
  const currentTime = getCurrentTime();
  const hasActiveDeals = restaurant.deals.some(
    deal => isTimeInRange(currentTime, deal.startTime, deal.endTime)
  );
  
  const bestDeal = restaurant.deals.reduce((best, current) => {
    // If current deal is active and has a higher discount than the best one
    if (isTimeInRange(currentTime, current.startTime, current.endTime)) {
      if (!best || parseFloat(current.discount) > parseFloat(best.discount)) {
        return current;
      }
    }
    return best;
  }, restaurant.deals[0]);

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={() => onPress(restaurant)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        
        {hasActiveDeals && (
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={["#FF8C00", "#FFB347"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>Active Deals</Text>
            </LinearGradient>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{restaurant.distance} km</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {formatTime(restaurant.openingHours.open)} - {formatTime(restaurant.openingHours.close)}
            </Text>
          </View>
        </View>
        
        {bestDeal && (
          <View style={styles.dealContainer}>
            <Text style={styles.dealTitle} numberOfLines={1}>{bestDeal.title}</Text>
            <Text style={styles.dealDiscount}>{bestDeal.discount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  cuisine: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  dealContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    flex: 1,
  },
  dealDiscount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
});