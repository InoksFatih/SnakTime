import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imageUrl: string;
  role: "USER" | "SERVICE_SUPPLIER";
}

interface AuthState {
  user: AuthUser | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      setToken: (token) =>
        set({ authToken: token }),

      logout: async () => {
        // Clear persisted auth store
        await AsyncStorage.removeItem("food-finder-auth");

        set({
          user: null,
          authToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "food-finder-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
