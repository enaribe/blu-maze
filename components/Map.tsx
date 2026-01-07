import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
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

  // Gambia default region (Kotu Layout, Serrekunda)
  const defaultRegion: Region = {
    latitude: 13.4549,
    longitude: -16.6788,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    if (showUserLocation) {
      getUserLocation();
    } else {
      setLoading(false);
    }
  }, [showUserLocation]);

  const getUserLocation = async () => {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your position on the map.'
        );
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location);
      setLoading(false);

      // Animate to user location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  // Fit map to show all markers and route
  useEffect(() => {
    if (mapRef.current && (markers.length > 0 || route.length > 0)) {
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
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }
    }
  }, [markers, route, userLocation]);

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
        onRegionChangeComplete={onRegionChange}
        onMapReady={() => {
          setLoading(false);
          onMapReady?.();
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
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor={Colors.primary}
            strokeWidth={4}
          />
        )}
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
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
