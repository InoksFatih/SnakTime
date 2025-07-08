import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push("/phone");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent"]}
        style={styles.gradient}
      />
      
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop" }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Food Finder</Text>
          <Text style={styles.subtitle}>Discover amazing deals nearby</Text>
        </View>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🔍</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Find Local Deals</Text>
              <Text style={styles.featureDescription}>
                Discover restaurants offering special time-based discounts near you
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>💰</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Save Money</Text>
              <Text style={styles.featureDescription}>
                Enjoy exclusive discounts during off-peak hours
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📱</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Easy Redemption</Text>
              <Text style={styles.featureDescription}>
                Just show your QR code at the restaurant to claim your deal
              </Text>
            </View>
          </View>
        </View>
        
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          fullWidth
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
  backgroundImage: {
    position: "absolute",
    width,
    height,
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingBottom: 40,
    zIndex: 2,
  },
  header: {
    marginTop: height * 0.15,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});