import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/Colors';

/**
 * Phone Number Input Screen
 * User enters phone number to receive OTP
 */

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    // TODO: Integrate Firebase Phone Auth
    if (phoneNumber.length >= 7) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push('/(auth)/verify');
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
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.inputRow}>
          {/* Flag Selector Placeholder */}
          <TouchableOpacity style={styles.flagContainer}>
            <Text style={styles.flagText}>🇬🇲</Text>
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
