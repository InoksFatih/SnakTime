import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phoneNumber: string;
  verificationId: string;
  isVerified: boolean;
  
  // Actions
  setPhoneNumber: (phone: string) => void;
  setVerificationId: (id: string) => void;
  setIsVerified: (verified: boolean) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      phoneNumber: "",
      verificationId: "",
      isVerified: false,
      
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setVerificationId: (id) => set({ verificationId: id }),
      setIsVerified: (verified) => set({ isVerified: verified }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        phoneNumber: "", 
        verificationId: "", 
        isVerified: false 
      }),
    }),
    {
      name: "food-finder-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);