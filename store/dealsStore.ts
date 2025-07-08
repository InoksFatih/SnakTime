import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedDeal } from "@/types";

interface DealsState {
  savedDeals: SavedDeal[];
  
  // Actions
  addSavedDeal: (deal: SavedDeal) => void;
  markDealAsUsed: (dealId: string) => void;
  removeSavedDeal: (dealId: string) => void;
}

export const useDealsStore = create<DealsState>()(
  persist(
    (set) => ({
      savedDeals: [],
      
      addSavedDeal: (deal) => set((state) => ({
        savedDeals: [...state.savedDeals, deal]
      })),
      
      markDealAsUsed: (dealId) => set((state) => ({
        savedDeals: state.savedDeals.map(deal => 
          deal.id === dealId ? { ...deal, isUsed: true } : deal
        )
      })),
      
      removeSavedDeal: (dealId) => set((state) => ({
        savedDeals: state.savedDeals.filter(deal => deal.id !== dealId)
      })),
    }),
    {
      name: "food-finder-deals",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);