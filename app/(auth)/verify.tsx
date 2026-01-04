import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';

/**
 * OTP Verification Screen
 * User enters 6-digit code received via SMS
 */

export default function VerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    // TODO: Integrate Firebase Phone Auth verification
    if (code.length === 6) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push('/(auth)/profile');
      }, 1000);
    }
  };

  const handleResend = () => {
    setTimer(60);
    // TODO: Resend OTP
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a code to +220 XXX XXXX
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
          />
        </View>

        {timer > 0 ? (
          <Text style={styles.timer}>Resend code in {timer}s</Text>
        ) : (
          <Text style={styles.resend} onPress={handleResend}>
            Resend code
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          disabled={code.length !== 6}
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
  timer: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  resend: {
    ...Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
