import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';

/**
 * Profile Setup Screen
 * User enters name and optionally uploads photo
 */

export default function ProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    // TODO: Save user profile to Firebase
    if (firstName.trim() && lastName.trim()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push('/(auth)/pin');
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>Help us get to know you better</Text>

        {/* Profile Photo Placeholder */}
        <TouchableOpacity style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoIcon}>📷</Text>
          </View>
          <Text style={styles.photoText}>Add Photo (Optional)</Text>
        </TouchableOpacity>

        <View style={styles.inputsContainer}>
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
          />
          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleNext}
          loading={loading}
          disabled={!firstName.trim() || !lastName.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  photoIcon: {
    fontSize: 40,
  },
  photoText: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: 12,
  },
  inputsContainer: {
    gap: 8,
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
