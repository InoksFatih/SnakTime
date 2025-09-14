import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text.primary,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="restaurant/[id]" 
          options={{ 
            title: "",
            headerTransparent: true,
            headerTintColor: "#FFFFFF",
          }} 
        />
        <Stack.Screen 
          name="deal/[id]" 
          options={{ 
            title: "Deal Details",
          }} 
        />
        <Stack.Screen 
          name="qrcode/[id]" 
          options={{ 
            title: "QR Code",
            presentation: "modal",
          }} 
        />
      </Stack>
    </>
  );
}