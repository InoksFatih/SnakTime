import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
} from "lucide-react-native";
import DealCard from "@/components/DealCard";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant, Deal } from "@/types";
import { formatTime } from "@/utils/time";

const { width, height } = Dimensions.get("window");

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundRestaurant = restaurants.find((r) => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
      }
    }
  }, [id]);
  
  const handleDealPress = (deal: Deal) => {
    router.push(`/deal/${deal.id}`);
  };
  
  const handleShare = () => {
    // In a real app, this would open the share dialog
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.image}
            contentFit="cover"
          />
          
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{restaurant.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={18} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.rating}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
            </View>
            
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.text.secondary} />
                <Text style={styles.infoText}>{restaurant.address}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Clock size={16} color={Colors.text.secondary} />
                <Text style={styles.infoText}>
                  Open hours: {formatTime(restaurant.openingHours.open)} - {formatTime(restaurant.openingHours.close)}
                </Text>
              </View>
            </View>

            <View style={styles.menuHighlights}>
              <Text style={styles.menuHighlightsTitle}>Menu Highlights:</Text>
              <Text style={styles.menuHighlightsText}>{restaurant.cuisine}</Text>
            </View>
          </View>
          
          <View style={styles.dealsContainer}>
            <Text style={styles.dealsTitle}>Available Deals</Text>
            
            {restaurant.deals.length > 0 ? (
              restaurant.deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onPress={handleDealPress}
                />
              ))
            ) : (
              <View style={styles.noDealsContainer}>
                <Text style={styles.noDealsText}>
                  No deals available at this restaurant
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 100,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cuisine: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  menuHighlights: {
    marginTop: 8,
  },
  menuHighlightsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  menuHighlightsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  dealsContainer: {
    marginTop: 8,
  },
  dealsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  noDealsContainer: {
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: "center",
  },
  noDealsText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});