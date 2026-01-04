import { create } from 'zustand';

/**
 * Blu Maze Global State Management
 * Using Zustand for simple and performant state management
 */

// Types
export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  profilePhoto?: string;
  pin?: string;
  createdAt?: Date;
}

export interface Address {
  label: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export interface Ride {
  rideId: string;
  driverId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickup: Address;
  destination: Address;
  price: number;
  distance: number;
  duration: number;
  createdAt: Date;
}

// Store Interface
interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;

  // Current Ride State
  currentRide: Ride | null;

  // Saved Addresses
  homeAddress: Address | null;
  officeAddress: Address | null;
  favoriteAddresses: Address[];

  // Actions
  setUser: (user: User) => void;
  logout: () => void;

  setCurrentRide: (ride: Ride | null) => void;

  setHomeAddress: (address: Address | null) => void;
  setOfficeAddress: (address: Address | null) => void;
  addFavoriteAddress: (address: Address) => void;
  removeFavoriteAddress: (label: string) => void;
}

// Create Store
export const useStore = create<AppState>((set) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  currentRide: null,
  homeAddress: null,
  officeAddress: null,
  favoriteAddresses: [],

  // Auth Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      currentRide: null,
    }),

  // Ride Actions
  setCurrentRide: (ride) =>
    set({
      currentRide: ride,
    }),

  // Address Actions
  setHomeAddress: (address) =>
    set({
      homeAddress: address,
    }),

  setOfficeAddress: (address) =>
    set({
      officeAddress: address,
    }),

  addFavoriteAddress: (address) =>
    set((state) => ({
      favoriteAddresses: [...state.favoriteAddresses, address],
    })),

  removeFavoriteAddress: (label) =>
    set((state) => ({
      favoriteAddresses: state.favoriteAddresses.filter(
        (addr) => addr.label !== label
      ),
    })),
}));

// Selectors (for optimized re-renders)
export const selectUser = (state: AppState) => state.user;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
export const selectCurrentRide = (state: AppState) => state.currentRide;
export const selectAddresses = (state: AppState) => ({
  home: state.homeAddress,
  office: state.officeAddress,
  favorites: state.favoriteAddresses,
});
