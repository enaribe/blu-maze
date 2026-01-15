import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../lib/store';

/**
 * Phone Number Input Screen
 * User enters phone number to receive OTP
 */

// Country codes for supported countries
const COUNTRIES = [
  { code: '+220', flag: '🇬🇲', name: 'Gambia' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
];

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default to Senegal

  const { setConfirmation } = useStore();

  const handleNext = async () => {
    if (phoneNumber.length < 7) return;

    setLoading(true);
    try {
      // Format phone number with selected country code
      let formattedNumber: string;
      if (phoneNumber.startsWith('+')) {
        // User already included country code
        formattedNumber = phoneNumber;
      } else {
        // Use selected country code
        const cleanedNumber = phoneNumber.replace(/^0+/, '');
        formattedNumber = `${selectedCountry.code}${cleanedNumber}`;
      }

      console.log('Sending OTP to:', formattedNumber);

      // Send verification code
      // Note: Ensure Firebase project is on Blaze plan and SMS region is enabled
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);

      // Store confirmation for verify screen
      setConfirmation(confirmation);

      // Navigate to verify screen
      router.push({
        pathname: '/(auth)/verify',
        params: { phoneNumber: formattedNumber }
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let message = 'Failed to send verification code. Please try again.';

      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/operation-not-allowed') {
        // Check if error message mentions region
        const errorMsg = error.message || '';
        if (errorMsg.includes('region') || errorMsg.includes('SMS')) {
          const countryName = selectedCountry.name;
          const countryCode = selectedCountry.code;
          message = `SMS region not enabled for ${countryName} (${countryCode}). Steps to fix:\n\n1. Go to Firebase Console > Authentication > Settings\n2. Find "SMS Region Policy" section\n3. Click "Add region" or "Manage regions"\n4. Select "Allow" for ${countryName} (${countryCode}) or "Allow all regions" for testing\n5. Ensure your Firebase project is on Blaze plan (not Spark)\n6. Wait 2-5 minutes for changes to propagate\n7. Close and reopen the app`;
        } else {
          message = 'Phone authentication not enabled. Steps:\n\n1. Firebase Console > Authentication > Sign-in method > Phone > Enable\n2. Upgrade to Blaze plan (pay-as-you-go) - required for phone auth\n3. Configure SMS Region Policy in Settings\n4. Wait 2-5 minutes for changes to propagate\n5. Close and reopen the app';
        }
      }

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.inputRow}>
          {/* Country Selector */}
          <TouchableOpacity 
            style={styles.flagContainer}
            onPress={() => {
              // Toggle between countries (simple implementation)
              const currentIndex = COUNTRIES.findIndex(c => c.code === selectedCountry.code);
              const nextIndex = (currentIndex + 1) % COUNTRIES.length;
              setSelectedCountry(COUNTRIES[nextIndex]);
            }}
          >
            <Text style={styles.flagText}>{selectedCountry.flag}</Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="| 700 0000"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoFocus
            />
          </View>
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
          disabled={phoneNumber.length < 7}
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
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 10,
  },
  flagContainer: {
    width: 80,
    height: 56,
    backgroundColor: Colors.input, // Match input bg
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  flagText: {
    fontSize: 24,
  },
  chevron: {
    color: Colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  phoneInputContainer: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333', // Slightly lighter border if needed or transparent
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  phoneInput: {
    color: Colors.text,
    fontSize: 18,
    height: '100%',
  },
  terms: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'left', // Design has left align? or center? Image 1 looks left aligned below input? No it is centered in the first design but left aligned here maybe?
    // Looking at image 1: "By continuing..." is below input, small text. It looks left aligned.
    lineHeight: 18,
    marginTop: 10,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: Colors.primary, // Teal
    borderRadius: 27.5,
  }
});
