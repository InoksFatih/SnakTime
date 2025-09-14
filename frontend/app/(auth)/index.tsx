import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import Button from "@/components/ui/Button";

import Colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background with gradient overlay */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.8)', 'rgba(147, 51, 234, 0.9)', 'rgba(17, 24, 39, 0.95)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>
          <Text style={styles.title}>Snak Time</Text>
          <Text style={styles.subtitle}>
            Découvrez des offres incroyables près de chez vous
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.featureEmoji}>🔍</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Trouvez des Offres Locales</Text>
              <Text style={styles.featureDescription}>
                Découvrez des restaurants proposant des réductions spéciales selon l'heure près de vous
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#10B981' }]}>
              <Text style={styles.featureEmoji}>💰</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Économisez de l'Argent</Text>
              <Text style={styles.featureDescription}>
                Profitez de réductions exclusives pendant les heures creuses
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#8B5CF6' }]}>
              <Text style={styles.featureEmoji}>📱</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Utilisation Facile</Text>
              <Text style={styles.featureDescription}>
                Montrez simplement votre code QR au restaurant pour bénéficier de votre offre
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Button
            title="Commencer"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            fullWidth
          />
          <Text style={styles.footerText}>
            Rejoignez des milliers d'utilisateurs qui économisent chaque jour
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
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
    paddingBottom: 50,
    zIndex: 2,
  },
  header: {
    marginTop: height * 0.12,
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featureEmoji: {
    fontSize: 26,
  },
  featureText: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  ctaSection: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});