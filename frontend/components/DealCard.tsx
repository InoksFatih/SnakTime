import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Deal } from "@/types";
import { formatTime, isTimeInRange, getCurrentTime, getTimeRemaining } from "@/utils/time";

interface DealCardProps {
  deal: Deal;
  onPress: (deal: Deal) => void;
}

export default function DealCard({ deal, onPress }: DealCardProps) {
  const currentTime = getCurrentTime();
  const isActive = isTimeInRange(currentTime, deal.startTime, deal.endTime);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(deal)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: deal.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
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
        <Text style={styles.title} numberOfLines={1}>{deal.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{deal.description}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>${deal.discountedPrice.toFixed(2)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{deal.discount}</Text>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Clock size={14} color={Colors.text.secondary} />
          <Text style={styles.timeText}>
            {formatTime(deal.startTime)} - {formatTime(deal.endTime)}
          </Text>
          
          {isActive && (
            <Text style={styles.remainingText}>
              Ends in {getTimeRemaining(deal.endTime)}
            </Text>
          )}
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
  imageContainer: {
    height: 140,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
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
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
    marginRight: 8,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
});