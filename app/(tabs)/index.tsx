import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Search, Filter, MapPin } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Map from "@/components/Map";
import RestaurantCard from "@/components/RestaurantCard";
import Input from "@/components/ui/Input";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant } from "@/types";
import { getCurrentTime, isTimeInRange } from "@/utils/time";

const { width } = Dimensions.get("window");

export default function NearbyScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeDealsOnly, setActiveDealsOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const scrollYThreshold = 100;

  const currentTime = getCurrentTime();

  const filteredRestaurants = activeDealsOnly
    ? restaurants.filter(restaurant =>
        restaurant.deals.some(deal =>
          isTimeInRange(currentTime, deal.startTime, deal.endTime)
        )
      )
    : restaurants;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > scrollYThreshold);
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    const index = filteredRestaurants.findIndex(r => r.id === restaurant.id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={isScrolled} />
      <View>
        <View style={styles.header}>
          <View style={styles.locationHeader}>
            <MapPin size={18} color={Colors.text.primary} />
            <Text style={styles.locationText}>FoodFinder</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Search restaurants or cuisines"
            leftIcon={<Search size={20} color={Colors.text.secondary} />}
            containerStyle={styles.searchInput}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterIconButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersRow}>
            {["cuisine", "rating", "distance"].map(filter => (
              <TouchableOpacity
              activeOpacity={0.8}
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipSelected,
                ]}
                onPress={() => handleFilterSelect(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextSelected,
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
            activeOpacity={0.8}
              style={[
                styles.filterChip,
                activeDealsOnly && styles.filterChipSelected,
              ]}
              onPress={() => setActiveDealsOnly(!activeDealsOnly)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeDealsOnly && styles.filterChipTextSelected,
                ]}
              >
                Active Deals
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Map
          restaurants={filteredRestaurants}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={handleSelectRestaurant}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {activeDealsOnly ? "Active Deals" : "Nearby Restaurants"}
          </Text>
          <Text style={styles.listSubtitle}>
            {filteredRestaurants.length}{" "}
            {filteredRestaurants.length === 1 ? "restaurant" : "restaurants"} found
          </Text>
        </View>
      </View>

      {/* Horizontal Carousel at Bottom */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.85 + 16}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={handleRestaurantPress}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 280,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 32 : 48,
    paddingBottom: 8,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginLeft: 6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  filterChipTextSelected: {
    color: "#fff",
  },
  listHeader: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  listSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  carouselContainer: {
    position: "absolute",
    
    bottom: -20,
    left: 0,
    right: 0,
    height: 260,
  },
  carousel: {
    paddingHorizontal: 12,
  },
});
