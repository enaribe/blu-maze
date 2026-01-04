import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';

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
      <View style={styles.content}>
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.inputContainer}>
          <Input
            label="Phone Number"
            placeholder="+220 XXX XXXX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoFocus
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
          disabled={phoneNumber.length < 7}
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
    paddingTop: 60,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  terms: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
