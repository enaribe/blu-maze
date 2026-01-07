import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { usersCollection } from '../../lib/firebase';
import { useStore } from '../../lib/store';

export default function VerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Ref to the actual text input
  const inputRef = useRef<TextInput>(null);

  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;
  const { confirmation, setUser, setConfirmation } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (code.length === 6) {
      if (!confirmation) {
        Alert.alert('Error', 'No verification session found. Please try again.');
        router.back();
        return;
      }

      setLoading(true);
      try {
        // Confirm the code
        const userCredential = await confirmation.confirm(code);
        const firebaseUser = userCredential?.user;

        if (firebaseUser) {
          // Check if user exists in Firestore
          const userDoc = await usersCollection.doc(firebaseUser.uid).get();

          if (userDoc.exists()) {
            // Existing user - load profile
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              phoneNumber: firebaseUser.phoneNumber || phoneNumber,
              firstName: userData?.firstName || '',
              lastName: userData?.lastName || '',
              email: userData?.email,
              profilePhoto: userData?.profilePhoto,
              pin: userData?.pin,
            });

            // If PIN exists, go to unlock, else go to pin creation (unlikely if exists)
            if (userData?.pin) {
              router.replace('/(auth)/unlock');
            } else {
              router.replace('/(auth)/pin');
            }
          } else {
            // New user - go to profile setup
            router.push({
              pathname: '/(auth)/profile',
              params: {
                userId: firebaseUser.uid,
                phoneNumber: firebaseUser.phoneNumber || phoneNumber
              }
            });
          }

          // Clear confirmation session
          setConfirmation(null);
        }
      } catch (error: any) {
        console.error('Error verifying code:', error);
        let message = 'Failed to verify code. Please try again.';
        if (error.code === 'auth/invalid-verification-code') {
          message = 'Invalid verification code.';
        } else if (error.code === 'auth/code-expired') {
          message = 'Verification code has expired.';
        }
        Alert.alert('Error', message);
        setCode('');
      } finally {
        setLoading(false);
      }
    }
  };

  const codeDigits = Array(6).fill(0).map((_, i) => code[i] || '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // You can adjust this if needed
    >
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logoheader.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to {phoneNumber}
        </Text>

        {/* Hidden Input for Keyboard Handling */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(text) => {
            if (text.length <= 6) setCode(text);
          }}
          keyboardType="number-pad"
          style={styles.hiddenInput}
          autoFocus
          maxLength={6}
        />

        {/* Visible Code Display */}
        <TouchableOpacity
          style={styles.codeContainer}
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
        >
          {codeDigits.map((digit, index) => (
            <View key={index} style={styles.digitContainer}>
              <Text style={styles.digit}>{digit}</Text>
              <View style={[
                styles.underline,
                // Highlight underline if this is the next digit to enter or active
                index === code.length ? styles.activeUnderline : null,
                // Or if filled
                digit ? styles.filledUnderline : null
              ]} />
            </View>
          ))}
        </TouchableOpacity>

        <Text style={styles.timerText}>
          Code expires in: <Text style={styles.timerBold}>00:{timer.toString().padStart(2, '0')}</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleVerify}
          loading={loading}
          disabled={code.length !== 6}
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
    alignItems: 'center', // Center title and subtitle too? 
    // Wait, design 2 title/subtitle are left-aligned in my previous implementation.
    // User said "code n'est pas centre".
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center', // Centering title/subtitle as well might look better if code is centered
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    lineHeight: 24,
    textAlign: 'center',
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
    gap: 12,
  },
  digitContainer: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: '#333',
  },
  activeUnderline: {
    backgroundColor: Colors.primary,
  },
  filledUnderline: {
    backgroundColor: Colors.primary,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  timerBold: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
    width: '100%',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 27.5,
  }
});
