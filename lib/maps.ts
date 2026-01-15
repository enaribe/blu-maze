/**
 * Google Maps Utilities
 * Functions for directions, distance, geocoding, etc.
 */

// IMPORTANT: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAFGHTBWWghUIVOKXeVd0Yvh0jeP08FgRo';

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
    console.log('🗺️ [Directions] ===== DEBUT getDirections =====');
    console.log('🗺️ [Directions] Origin:', origin);
    console.log('🗺️ [Directions] Destination:', destination);
    
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log('🗺️ [Directions] Request URL:', url.replace(GOOGLE_MAPS_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const data = await response.json();
    
    console.log('🗺️ [Directions] API Response Status:', data.status);
    console.log('🗺️ [Directions] API Response Error Message:', data.error_message || 'None');
    console.log('🗺️ [Directions] Number of routes:', data.routes?.length || 0);

    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];

      console.log('🗺️ [Directions] ✅ Route found!');
      console.log('🗺️ [Directions] Route summary:', route.summary);
      console.log('🗺️ [Directions] Has overview_polyline:', !!route.overview_polyline);
      console.log('🗺️ [Directions] overview_polyline.points exists:', !!route.overview_polyline?.points);
      console.log('🗺️ [Directions] overview_polyline.points length:', route.overview_polyline?.points?.length || 0);

      // Extract distance and duration
      const distance = leg.distance.value / 1000; // meters to km
      const duration = leg.duration.value / 60; // seconds to minutes
      
      console.log('🗺️ [Directions] Distance:', distance, 'km');
      console.log('🗺️ [Directions] Duration:', duration, 'minutes');

      // Decode polyline
      if (!route.overview_polyline || !route.overview_polyline.points) {
        console.error('🗺️ [Directions] ❌ ERROR: overview_polyline.points is missing!');
        console.error('🗺️ [Directions] Route object:', JSON.stringify(route, null, 2));
        return null;
      }

      const polylinePoints = decodePolyline(route.overview_polyline.points);
      console.log('🗺️ [Directions] ✅ Polyline decoded successfully');
      console.log('🗺️ [Directions] Number of decoded points:', polylinePoints.length);
      
      if (polylinePoints.length > 0) {
        console.log('🗺️ [Directions] First point:', polylinePoints[0]);
        console.log('🗺️ [Directions] Last point:', polylinePoints[polylinePoints.length - 1]);
      } else {
        console.error('🗺️ [Directions] ❌ ERROR: Decoded polyline is empty!');
        console.error('🗺️ [Directions] Encoded polyline string:', route.overview_polyline.points);
      }

      // Calculate price
      const price = calculatePrice(distance, duration);
      console.log('🗺️ [Directions] Calculated price:', price);

      const result = {
        distance,
        duration,
        route: polylinePoints,
        price,
      };
      
      console.log('🗺️ [Directions] ✅ Returning result with', polylinePoints.length, 'route points');
      console.log('🗺️ [Directions] ===== FIN getDirections (SUCCESS) =====');
      
      return result;
    }

    console.error('🗺️ [Directions] ❌ ERROR: No route found or API error');
    console.error('🗺️ [Directions] Status:', data.status);
    console.error('🗺️ [Directions] Error message:', data.error_message || 'No error message');
    console.error('🗺️ [Directions] Full response:', JSON.stringify(data, null, 2));
    console.log('🗺️ [Directions] ===== FIN getDirections (FAILED) =====');
    
    return null;
  } catch (error) {
    console.error('🗺️ [Directions] ❌ EXCEPTION in getDirections:', error);
    console.error('🗺️ [Directions] Error details:', JSON.stringify(error, null, 2));
    console.log('🗺️ [Directions] ===== FIN getDirections (EXCEPTION) =====');
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
  console.log('🗺️ [DecodePolyline] Starting decode, encoded length:', encoded.length);
  
  if (!encoded || encoded.length === 0) {
    console.error('🗺️ [DecodePolyline] ❌ ERROR: Encoded string is empty!');
    return [];
  }
  
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

    // Validate coordinates
    if (isNaN(point.latitude) || isNaN(point.longitude)) {
      console.error('🗺️ [DecodePolyline] ❌ ERROR: Invalid coordinates decoded:', point);
      continue;
    }
    
    if (point.latitude < -90 || point.latitude > 90 || point.longitude < -180 || point.longitude > 180) {
      console.error('🗺️ [DecodePolyline] ❌ ERROR: Coordinates out of range:', point);
      continue;
    }

    poly.push(point);
  }

  console.log('🗺️ [DecodePolyline] ✅ Decoded', poly.length, 'points');
  if (poly.length > 0) {
    console.log('🗺️ [DecodePolyline] First point:', poly[0]);
    console.log('🗺️ [DecodePolyline] Last point:', poly[poly.length - 1]);
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
    console.log('🗺️ [Maps] Reverse geocoding:', coords);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log('🗺️ [Maps] Geocoding URL:', url.replace(GOOGLE_MAPS_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const data = await response.json();
    console.log('🗺️ [Maps] Geocoding response status:', data.status);

    if (data.status === 'OK' && data.results.length > 0) {
      const address = data.results[0].formatted_address;
      console.log('🗺️ [Maps] ✅ Address found:', address);
      return address;
    }

    if (data.status === 'REQUEST_DENIED') {
      console.error('🗺️ [Maps] ❌ API Geocoding REQUEST_DENIED - Please enable Geocoding API in Google Cloud Console');
      console.error('🗺️ [Maps] Go to: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com');
    } else {
      console.warn('🗺️ [Maps] ⚠️ No address found for coordinates. Status:', data.status);
    }
    return null;
  } catch (error) {
    console.error('🗺️ [Maps] ❌ Error reverse geocoding:', error);
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
