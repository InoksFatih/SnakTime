export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  address: string;
  distance: number; // in km
  coordinates: {
    latitude: number;
    longitude: number;
  };
  deals: Deal[];
  openingHours: {
    open: string;
    close: string;
  };
}

export interface Deal {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  startTime: string;
  endTime: string;
  image: string;
  isActive: boolean;
}

export interface SavedDeal {
  id: string;
  dealId: string;
  restaurantId: string;
  qrCode: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
}