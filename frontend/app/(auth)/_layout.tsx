import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
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
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="profile"
        options={{
          title: "Complete Profile",
        }}
      />
    </Stack>
  );
}