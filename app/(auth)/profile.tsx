import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../../components/ui';
import { Colors } from '../../constants/Colors';

/**
 * Profile Setup Screen
 * User enters name
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
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logoheader.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Please enter your first and last name to access the app</Text>

        <View style={styles.inputsContainer}>
          <Input
            label="First name"
            placeholder=""
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
            style={styles.inputStyle}
          />
          <Input
            label="Last name"
            placeholder=""
            value={lastName}
            onChangeText={setLastName}
            style={styles.inputStyle}
          />
        </View>

        <Text style={styles.terms}>
          By continuing you are acknowledging having read and accepted our{' '}
          <Text style={styles.link}>Terms and Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          loading={loading}
          disabled={!firstName.trim() || !lastName.trim()}
          style={styles.nextButton}
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
  header: {
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 40,
    height: 100,
    justifyContent: 'center',
  },
  headerLogo: {
    width: 150,
    height: 60,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    borderColor: '#333',
    borderWidth: 1,
  },
  terms: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 18,
    marginTop: 20,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 27.5,
  }
});
