import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

/**
 * Places Autocomplete Component
 * Searches for places using Google Places API
 */

const GOOGLE_MAPS_API_KEY = 'AIzaSyAFGHTBWWghUIVOKXeVd0Yvh0jeP08FgRo';

interface Place {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

interface PlacesAutocompleteProps {
  placeholder?: string;
  onPlaceSelected: (place: { address: string; coords: { latitude: number; longitude: number } }) => void;
  icon?: any;
  value?: string;
}

export default function PlacesAutocomplete({
  placeholder = 'Search for a place',
  onPlaceSelected,
  icon = 'search',
  value = '',
}: PlacesAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search places with debounce
  const searchPlaces = async (text: string) => {
    if (text.length < 3) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      // Bias search to Senegal
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&components=country:sn&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const formatted = data.predictions.map((p: any) => ({
          place_id: p.place_id,
          description: p.description,
          main_text: p.structured_formatting.main_text,
          secondary_text: p.structured_formatting.secondary_text,
        }));
        setPredictions(formatted);
        setShowResults(true);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // Get place details (coordinates)
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const { geometry, formatted_address } = data.result;
        return {
          address: formatted_address,
          coords: {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
          },
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  };

  const handlePlaceSelect = async (place: Place) => {
    setQuery(place.main_text);
    setShowResults(false);
    setPredictions([]);

    // Get coordinates
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      onPlaceSelected(details);
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    searchPlaces(text);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setShowResults(true)}
        />
        {loading && <ActivityIndicator size="small" color={Colors.primary} />}
      </View>

      {/* Predictions List */}
      {showResults && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          {predictions.map((item) => (
            <TouchableOpacity 
              key={item.place_id}
              style={styles.predictionItem} 
              onPress={() => handlePlaceSelect(item)}
            >
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.predictionText}>
                <Text style={styles.mainText}>{item.main_text}</Text>
                <Text style={styles.secondaryText}>{item.secondary_text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  predictionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: 12,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 10,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 12,
  },
  predictionText: {
    flex: 1,
  },
  mainText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  secondaryText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
