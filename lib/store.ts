import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// ... (keep previous interfaces)

export interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  confirmation: FirebaseAuthTypes.ConfirmationResult | null;

  // Current Ride State
  currentRide: Ride | null;

  // Saved Addresses
  homeAddress: Address | null;
  officeAddress: Address | null;
  favoriteAddresses: Address[];

  // Actions
  setUser: (user: User) => void;
  setConfirmation: (confirmation: FirebaseAuthTypes.ConfirmationResult | null) => void;
  logout: () => void;
  completeOnboarding: () => void;

  setCurrentRide: (ride: Ride | null) => void;

  setHomeAddress: (address: Address | null) => void;
  setOfficeAddress: (address: Address | null) => void;
  addFavoriteAddress: (address: Address) => void;
  removeFavoriteAddress: (label: string) => void;
}

// Create Store
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      confirmation: null,
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

      setConfirmation: (confirmation) =>
        set({
          confirmation,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          confirmation: null,
          currentRide: null,
        }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
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
    }),
    {
      name: 'blu-maze-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        homeAddress: state.homeAddress,
        officeAddress: state.officeAddress,
        favoriteAddresses: state.favoriteAddresses,
      }),
    }
  )
);

// Selectors (for optimized re-renders)
export const selectUser = (state: AppState) => state.user;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
export const selectCurrentRide = (state: AppState) => state.currentRide;
export const selectAddresses = (state: AppState) => ({
  home: state.homeAddress,
  office: state.officeAddress,
  favorites: state.favoriteAddresses,
});
