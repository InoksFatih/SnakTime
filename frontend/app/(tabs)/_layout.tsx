import React from "react";
import { Tabs } from "expo-router";
import { MapPin, Search, QrCode, User, Home } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerTintColor: Colors.text.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Nearby",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: "My Deals",
          tabBarLabel: "Discount Cards",
          tabBarIcon: ({ color, size }) => (
            <QrCode size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}