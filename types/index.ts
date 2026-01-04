/**
 * Type Definitions for Blu Maze
 * Shared types across the application
 */

export type UserRole = 'passenger' | 'driver';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Address {
  label: string;
  address: string;
  coords: Location;
}

export interface User {
  userId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  profilePhoto?: string;
  pin: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver extends User {
  role: 'driver';
  isOnline: boolean;
  currentLocation?: Location;
  rating: number;
  totalRides: number;
  totalRevenue: number;
  balance: number;
  vehicle: Vehicle;
  documents: Documents;
  status: 'pending' | 'active' | 'suspended';
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  photos: {
    front: string;
    back: string;
    side: string;
    interior: string;
  };
}

export interface Documents {
  driverLicenseFront: string;
  driverLicenseBack: string;
  carInsurance: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Ride {
  rideId: string;
  userId: string;
  driverId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  type: 'instant' | 'scheduled';
  scheduledTime?: Date;
  pickup: Address;
  destination: Address;
  distance: number;
  duration: number;
  price: number;
  paymentMethod: 'cash' | 'card';
  ratings?: {
    passengerRating?: number;
    passengerComment?: string;
    driverRating?: number;
    driverComment?: string;
  };
  timestamps: {
    created: Date;
    accepted?: Date;
    started?: Date;
    completed?: Date;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ride_accepted' | 'driver_arrived' | 'trip_started' | 'trip_completed';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
