import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Card } from '../../components/ui';

/**
 * Home Screen - Main map view for ordering rides
 * TODO: Integrate Google Maps in next phase
 */

export default function HomeScreen() {
  const [rideType, setRideType] = useState<'instant' | 'scheduled'>('instant');

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️</Text>
          <Text style={styles.mapLabel}>Google Maps</Text>
          <Text style={styles.mapSubLabel}>Will be integrated in next phase</Text>
        </View>
      </View>

      {/* Bottom Sheet - Ride Booking */}
      <View style={styles.bottomSheet}>
        {/* Ride Type Selector */}
        <View style={styles.rideTypeContainer}>
          <TouchableOpacity
            style={[
              styles.rideTypeButton,
              rideType === 'instant' && styles.rideTypeButtonActive,
            ]}
            onPress={() => setRideType('instant')}
          >
            <Text
              style={[
                styles.rideTypeText,
                rideType === 'instant' && styles.rideTypeTextActive,
              ]}
            >
              Instant Ride
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rideTypeButton,
              rideType === 'scheduled' && styles.rideTypeButtonActive,
            ]}
            onPress={() => setRideType('scheduled')}
          >
            <Text
              style={[
                styles.rideTypeText,
                rideType === 'scheduled' && styles.rideTypeTextActive,
              ]}
            >
              Schedule Ride
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pickup & Destination */}
        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.addressInput}>Pickup location</Text>
          </View>
          <View style={styles.addressRow}>
            <View style={styles.dotRed} />
            <Text style={styles.addressInput}>Where to?</Text>
          </View>
        </View>

        {/* Order Button */}
        <Button
          title="Order Ride"
          onPress={() => {
            // TODO: Navigate to ride search
            alert('Ride booking coming in next phase!');
          }}
        />

        {/* Quick Access */}
        <View style={styles.quickAccess}>
          <QuickAccessButton icon="🏠" label="Home" />
          <QuickAccessButton icon="💼" label="Office" />
          <QuickAccessButton icon="⭐" label="Favorites" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function QuickAccessButton({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.quickButton}>
      <Text style={styles.quickIcon}>{icon}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 80,
    marginBottom: 16,
  },
  mapLabel: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 8,
  },
  mapSubLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bottomSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 10,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  rideTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.input,
    alignItems: 'center',
  },
  rideTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  rideTypeText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  rideTypeTextActive: {
    color: '#000',
  },
  addressContainer: {
    gap: 16,
    marginBottom: 24,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.input,
    padding: 16,
    borderRadius: 8,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
  },
  dotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
  },
  addressInput: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickButton: {
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: {
    fontSize: 32,
  },
  quickLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});
