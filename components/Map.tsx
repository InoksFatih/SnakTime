import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Platform, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Restaurant } from "@/types";

interface MapProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function Map({ restaurants, selectedRestaurant, onSelectRestaurant }: MapProps) {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        if (Platform.OS === "web") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              });
            },
            (error) => {
              setError("Error getting location");
              console.error(error);
            }
          );
        } else {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (err) {
        setError("Error getting location");
        console.error(err);
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.subText}>Please enable location services to see nearby restaurants</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  // On web, we'll show a placeholder since we can't use MapView
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <View style={styles.mapContent}>
            {selectedRestaurant && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>{selectedRestaurant.name}</Text>
                <Text style={styles.infoCardHours}>
                  Open hours: {selectedRestaurant.openingHours.open} - {selectedRestaurant.openingHours.close}
                </Text>
                <Text style={styles.infoCardMenu}>
                  Menu Highlights: {selectedRestaurant.cuisine}
                </Text>
                <Text style={styles.infoCardRating}>
                  Rating: {selectedRestaurant.rating}/5
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.webPinsContainer}>
            {restaurants.map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={[
                  styles.webPin,
                  selectedRestaurant?.id === restaurant.id && styles.webPinSelected
                ]}
                onPress={() => onSelectRestaurant(restaurant)}
              >
                <MapPin 
                  size={20} 
                  color={selectedRestaurant?.id === restaurant.id ? "#FFFFFF" : Colors.primary} 
                  fill={selectedRestaurant?.id === restaurant.id ? Colors.primary : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.webMapNote}>
            Interactive map available on mobile devices
          </Text>
        </View>
      </View>
    );
  }

  // For mobile, we would use MapView from react-native-maps
  // But since we're limited to Expo packages, we'll show a placeholder
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapContent}>
          {selectedRestaurant && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>{selectedRestaurant.name}</Text>
              <Text style={styles.infoCardHours}>
                Open hours: {selectedRestaurant.openingHours.open} - {selectedRestaurant.openingHours.close}
              </Text>
              <Text style={styles.infoCardMenu}>
                Menu Highlights: {selectedRestaurant.cuisine}
              </Text>
              <Text style={styles.infoCardRating}>
                Rating: {selectedRestaurant.rating}/5
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.pinsContainer}>
          {restaurants.map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id} 
              style={[
                styles.pin,
                selectedRestaurant?.id === restaurant.id && styles.pinSelected
              ]}
              onPress={() => onSelectRestaurant(restaurant)}
            >
              <MapPin 
                size={24} 
                color={selectedRestaurant?.id === restaurant.id ? "#FFFFFF" : Colors.primary} 
                fill={selectedRestaurant?.id === restaurant.id ? Colors.primary : "transparent"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height * 0.35,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    overflow: "hidden",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.error,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    position: "relative",
  },
  mapContent: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  infoCardHours: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  infoCardMenu: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  infoCardRating: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
  },
  pinsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pinSelected: {
    backgroundColor: Colors.primary,
  },
  webMapPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    position: "relative",
  },
  webPinsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  webPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  webPinSelected: {
    backgroundColor: Colors.primary,
  },
  webMapNote: {
    fontSize: 12,
    color: Colors.text.light,
    fontStyle: "italic",
  },
});