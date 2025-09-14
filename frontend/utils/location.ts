import * as Location from "expo-location";
import { Platform } from "react-native";

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }
    
    // On web, we need to handle location differently
    if (Platform.OS === "web") {
      return new Promise<Location.LocationObject>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
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
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    }
    
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};