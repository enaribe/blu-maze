import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../constants/Colors';

interface MapComponentProps {
  initialRegion?: Region;
  showUserLocation?: boolean;
  markers?: Array<{
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
  }>;
  route?: Array<{ latitude: number; longitude: number }>;
  onRegionChange?: (region: Region) => void;
  onMapReady?: () => void;
}

/**
 * Map Component with Google Maps
 * Handles user location, markers, and routes
 */

export default function Map({
  initialRegion,
  showUserLocation = true,
  markers = [],
  route = [],
  onRegionChange,
  onMapReady,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  // Default region - will be updated to user location if available
  // Initial: Senegal (Dakar) as fallback, but will use user location if available
  const defaultRegion: Region = {
    latitude: 14.7167, // Dakar, Senegal
    longitude: -17.4677,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Debug logs
  console.log('🗺️ [Map] ===== Component mounted/updated =====');
  console.log('🗺️ [Map] Props:', {
    initialRegion,
    showUserLocation,
    markersCount: markers.length,
    routePoints: route.length,
  });
  console.log('🗺️ [Map] Route details:', {
    length: route.length,
    isEmpty: route.length === 0,
    hasOnePoint: route.length === 1,
    hasMultiplePoints: route.length > 1,
    firstPoint: route.length > 0 ? route[0] : null,
    lastPoint: route.length > 0 ? route[route.length - 1] : null,
  });
  console.log('🗺️ [Map] Using region:', initialRegion || defaultRegion);
  console.log('🗺️ [Map] PROVIDER_GOOGLE:', PROVIDER_GOOGLE);

  useEffect(() => {
    console.log('🗺️ [Map] useEffect - showUserLocation:', showUserLocation);
    if (showUserLocation) {
      getUserLocation();
    } else {
      console.log('🗺️ [Map] User location disabled, setting loading to false');
      setLoading(false);
    }
  }, [showUserLocation]);

  const getUserLocation = async () => {
    try {
      console.log('🗺️ [Map] Requesting location permissions...');
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('🗺️ [Map] Location permission status:', status);

      if (status !== 'granted') {
        console.warn('🗺️ [Map] ⚠️ Location permission denied');
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your position on the map.'
        );
        setLoading(false);
        return;
      }

      console.log('🗺️ [Map] Getting current position...');
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log('🗺️ [Map] ✅ Location obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      setUserLocation(location);
      setLoading(false);

      // Animate to user location
      if (mapRef.current) {
        console.log('🗺️ [Map] Animating to user location:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        // Use setTimeout to ensure map is fully ready
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
            console.log('🗺️ [Map] ✅ Animation to user location triggered');
          }
        }, 500);
      } else {
        console.warn('🗺️ [Map] ⚠️ mapRef.current is null, cannot animate');
      }
    } catch (error) {
      console.error('🗺️ [Map] ❌ Error getting location:', error);
      setLoading(false);
    }
  };

  // Fit map to show all markers and route (with delay to avoid multiple calls)
  useEffect(() => {
    if (!mapRef.current || (markers.length === 0 && route.length === 0)) {
      return;
    }

    // Add delay to avoid multiple fitToCoordinates calls
    const timeoutId = setTimeout(() => {
      if (!mapRef.current) return;

      const coordinates = [
        ...markers.map(m => m.coordinate),
        ...route,
      ];

      if (userLocation) {
        coordinates.push({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      }

      if (coordinates.length > 0) {
        console.log('🗺️ [Map] Fitting to coordinates:', coordinates.length);
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    }, 500); // Wait 500ms before fitting

    return () => clearTimeout(timeoutId);
  }, [markers, route, userLocation]);

  console.log('🗺️ [Map] Rendering MapView with:', {
    provider: PROVIDER_GOOGLE,
    initialRegion: initialRegion || defaultRegion,
    showUserLocation,
    loading,
    hasMapRef: !!mapRef.current,
    platform: Platform.OS,
  });
  
  console.log('🗺️ [Map] ⚠️ IMPORTANT: If map is white/blank, check:');
  console.log('🗺️ [Map] 1. Maps SDK APIs enabled in Google Cloud Console');
  console.log('🗺️ [Map] 2. App rebuilt with: npx expo prebuild --clean && npx expo run:android/ios');
  console.log('🗺️ [Map] 3. API key restrictions allow this app');

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion || defaultRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        mapType="standard"
        onRegionChangeComplete={(region) => {
          console.log('🗺️ [Map] Region changed:', region);
          onRegionChange?.(region);
        }}
        onMapReady={() => {
          console.log('🗺️ [Map] ✅ Map is ready!');
          console.log('🗺️ [Map] MapView rendered successfully');
          setLoading(false);
          onMapReady?.();
        }}
        onError={(error) => {
          console.error('🗺️ [Map] ❌ MapView error:', error);
          console.error('🗺️ [Map] Error details:', JSON.stringify(error, null, 2));
          Alert.alert(
            'Map Error',
            `Map failed to load. Please check:\n1. Google Maps API is enabled\n2. API key is valid\n3. Rebuild the app\n\nError: ${error.message || 'Unknown error'}`
          );
        }}
        onPress={(e) => {
          console.log('🗺️ [Map] Map pressed at:', e.nativeEvent.coordinate);
        }}
        onLoadStart={() => {
          console.log('🗺️ [Map] MapView load started...');
        }}
        onLoadEnd={() => {
          console.log('🗺️ [Map] ✅ MapView load ended - Map should be visible now');
        }}
        onLayout={() => {
          console.log('🗺️ [Map] MapView layout event - checking dimensions');
        }}
        customMapStyle={mapStyle}
      >
        {/* Custom Markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={Colors.primary}
          />
        ))}

        {/* Route Polyline */}
        {(() => {
          console.log('🗺️ [Map] Rendering Polyline check:');
          console.log('🗺️ [Map] route.length:', route.length);
          console.log('🗺️ [Map] route.length > 1:', route.length > 1);
          
          if (route.length > 0) {
            console.log('🗺️ [Map] First route point:', route[0]);
            console.log('🗺️ [Map] Last route point:', route[route.length - 1]);
            console.log('🗺️ [Map] All route points:', route.slice(0, 5), '...', route.slice(-5));
          }
          
          if (route.length > 1) {
            console.log('🗺️ [Map] ✅ Rendering Polyline with', route.length, 'points');
            // Use a more visible color - bright blue/cyan for better visibility on dark map
            const routeColor = '#00D9D5'; // Colors.primary but explicit for debugging
            console.log('🗺️ [Map] Polyline color:', routeColor);
            console.log('🗺️ [Map] Polyline strokeWidth: 6');
            
            return (
              <Polyline
                coordinates={route}
                strokeColor={routeColor}
                strokeWidth={6}
                lineCap="round"
                lineJoin="round"
                miterLimit={1}
                geodesic={true}
                tappable={false}
                zIndex={1}
              />
            );
          } else {
            console.warn('🗺️ [Map] ⚠️ NOT rendering Polyline: route.length =', route.length);
            return null;
          }
        })()}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

// Dark mode custom map style
const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Background noir pour voir si le container se rend
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B262C', // Couleur de fond si la carte ne charge pas
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
