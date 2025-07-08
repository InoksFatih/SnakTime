import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { QrCode, ShoppingBag } from "lucide-react-native";
import SavedDealCard from "@/components/SavedDealCard";
import Button from "@/components/ui/Button";
import Colors from "@/constants/colors";
import { useDealsStore } from "@/store/dealsStore";
import { SavedDeal } from "@/types";

export default function DealsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "used">("active");
  
  const savedDeals = useDealsStore((state) => state.savedDeals);
  
  const activeDeals = savedDeals.filter(deal => !deal.isUsed);
  const usedDeals = savedDeals.filter(deal => deal.isUsed);
  
  const displayedDeals = activeTab === "active" ? activeDeals : usedDeals;
  
  const handleDealPress = (savedDeal: SavedDeal) => {
    router.push(`/qrcode/${savedDeal.id}`);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    
    // In a real app, this would refresh the data from the backend
    // For this demo, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRefreshing(false);
  };
  
  const handleExplore = () => {
    router.navigate("/(tabs)");
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discount Cards</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "active" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active ({activeDeals.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "used" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("used")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "used" && styles.activeTabText,
            ]}
          >
            Redeemed ({usedDeals.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displayedDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavedDealCard
            savedDeal={item}
            onPress={handleDealPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {activeTab === "active" ? (
              <>
                <QrCode size={64} color={Colors.text.light} />
                <Text style={styles.emptyTitle}>No active deals</Text>
                <Text style={styles.emptySubtitle}>
                  Explore restaurants to find and save deals
                </Text>
                <Button
                  title="Explore Deals"
                  onPress={handleExplore}
                  style={styles.exploreButton}
                />
              </>
            ) : (
              <>
                <ShoppingBag size={64} color={Colors.text.light} />
                <Text style={styles.emptyTitle}>No redeemed deals</Text>
                <Text style={styles.emptySubtitle}>
                  Your redeemed deals will appear here
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  exploreButton: {
    marginTop: 8,
  },
});