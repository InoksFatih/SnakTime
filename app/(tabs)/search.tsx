import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Search, X } from "lucide-react-native";
import Input from "@/components/ui/Input";
import Colors from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { Restaurant } from "@/types";

// Extract unique cuisines from restaurants
const cuisines = Array.from(
  new Set(restaurants.map((restaurant) => restaurant.cuisine))
);

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  
  // Filter restaurants based on search query and selected cuisine
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      searchQuery === "" ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.deals.some((deal) =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCuisine =
      selectedCuisine === null || restaurant.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });
  
  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };
  
  const handleCuisinePress = (cuisine: string) => {
    setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Search restaurants, cuisines, or deals"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.text.secondary} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ) : null
          }
          containerStyle={styles.searchInput}
        />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cuisineContainer}
      >
        {cuisines.map((cuisine) => (
          <TouchableOpacity
          activeOpacity={0.8}
            key={cuisine}
            style={[
              styles.cuisineButton,
              selectedCuisine === cuisine && styles.selectedCuisine,
            ]}
            onPress={() => handleCuisinePress(cuisine)}
          >
            <Text
              style={[
                styles.cuisineText,
                selectedCuisine === cuisine && styles.selectedCuisineText,
              ]}
            >
              {cuisine}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {filteredRestaurants.length} {filteredRestaurants.length === 1 ? "Result" : "Results"}
        </Text>
        
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            activeOpacity={0.8}
              style={styles.resultItem}
              onPress={() => handleRestaurantPress(item)}
            >
              <View style={styles.resultImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.resultImage}
                  contentFit="cover"
                  transition={300}
                />
              </View>
              
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultCuisine}>{item.cuisine}</Text>
                
                <View style={styles.resultInfo}>
                  <View style={styles.resultRating}>
                    <Star size={14} color={Colors.warning} fill={Colors.warning} />
                    <Text style={styles.resultRatingText}>{item.rating}</Text>
                  </View>
                  
                  <Text style={styles.resultDistance}>{item.distance} km</Text>
                </View>
                
                {item.deals.length > 0 && (
                  <View style={styles.resultDealBadge}>
                    <Text style={styles.resultDealText}>
                      {item.deals.length} {item.deals.length === 1 ? "Deal" : "Deals"}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

import { Image } from "expo-image";
import { Star } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: 0,
  },
  cuisineContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  cuisineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
  },
  selectedCuisine: {
    backgroundColor: Colors.primary,
  },
  cuisineText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  selectedCuisineText: {
    color: "#FFFFFF",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  resultsList: {
    paddingBottom: 16,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultImageContainer: {
    width: 100,
    height: 100,
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  resultContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  resultCuisine: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  resultInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultRating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  resultRatingText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  resultDistance: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  resultDealBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resultDealText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});