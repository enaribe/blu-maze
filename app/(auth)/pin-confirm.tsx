import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useStore } from '../../lib/store';

/**
 * PIN Confirmation Screen
 * User re-enters PIN to confirm
 */

import * as Crypto from 'expo-crypto';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { firestore, usersCollection } from '../../lib/firebase';

export default function PinConfirmScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const params = useLocalSearchParams();
  const originalPin = params.originalPin as string;

  const handleNumberPress = async (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin !== originalPin) {
          Alert.alert('Error', 'PINs do not match. Please try again.');
          setPin('');
          router.back();
          return;
        }

        try {
          const { user, setUser, completeOnboarding } = useStore.getState();

          if (!user?.id) {
            Alert.alert('Error', 'Session lost. Please log in again.');
            router.replace('/(auth)/welcome');
            return;
          }

          // Hash PIN for Firestore
          const hashedPin = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            newPin
          );

          // Update Firestore
          await usersCollection.doc(user.id).update({
            pin: hashedPin,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

          // Save PIN locally for quick unlock
          await SecureStore.setItemAsync('user_pin', newPin);

          // Update local store with hashed PIN if needed (or just keep as is)
          setUser({ ...user, pin: hashedPin });
          completeOnboarding();

          // Navigate to (main) after auth is complete
          setTimeout(() => {
            router.replace('/(main)');
          }, 200);
        } catch (error) {
          console.error('Error saving PIN:', error);
          Alert.alert('Error', 'Failed to save PIN. Please try again.');
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Confirm your PIN</Text>
        <Text style={styles.subtitle}>
          Re-enter your PIN to confirm
        </Text>

        {/* PIN Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                pin.length > index && styles.dotFilled,
              ]}
            />
          ))}
        </View>

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.key}
              onPress={() => handleNumberPress(num.toString())}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.key} />
          <TouchableOpacity
            style={styles.key}
            onPress={() => handleNumberPress('0')}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={handleDelete}>
            <Text style={styles.deleteText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 60,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 320,
    alignSelf: 'center',
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    ...Typography.h1,
    color: Colors.text,
  },
  deleteText: {
    fontSize: 28,
    color: Colors.textSecondary,
  },
});
