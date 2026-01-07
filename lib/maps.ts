/**
 * Google Maps Utilities
 * Functions for directions, distance, geocoding, etc.
 */

// IMPORTANT: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDh-1JWqpK2QuqAz5a9yDL-MHmNEDp6kgQ';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DirectionsResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  route: Coordinates[]; // polyline coordinates
  price: number; // calculated price in GMD
}

/**
 * Get directions between two points using Google Directions API
 */
export async function getDirections(
  origin: Coordinates,
  destination: Coordinates
): Promise<DirectionsResult | null> {
  try {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];

      // Extract distance and duration
      const distance = leg.distance.value / 1000; // meters to km
      const duration = leg.duration.value / 60; // seconds to minutes

      // Decode polyline
      const polylinePoints = decodePolyline(route.overview_polyline.points);

      // Calculate price
      const price = calculatePrice(distance, duration);

      return {
        distance,
        duration,
        route: polylinePoints,
        price,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting directions:', error);
    return null;
  }
}

/**
 * Calculate price based on distance and duration
 * Pricing for Gambia (Dalasi - GMD)
 */
export function calculatePrice(distanceKm: number, durationMin: number): number {
  const BASE_FARE = 50; // D 50
  const PRICE_PER_KM = 15; // D 15/km
  const PRICE_PER_MIN = 5; // D 5/min

  const total = BASE_FARE + (distanceKm * PRICE_PER_KM) + (durationMin * PRICE_PER_MIN);

  // Round to nearest 5 GMD
  return Math.ceil(total / 5) * 5;
}

/**
 * Decode Google Maps polyline string to coordinates
 */
function decodePolyline(encoded: string): Coordinates[] {
  const poly: Coordinates[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    const point = {
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    };

    poly.push(point);
  }

  return poly;
}

/**
 * Geocode address to coordinates using Google Geocoding API
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
