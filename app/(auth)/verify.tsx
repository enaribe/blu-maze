import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/Colors';

export default function VerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Ref to the actual text input
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (code.length === 6) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push('/(auth)/profile');
      }, 1000);
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
          We sent a verification code to +221 774007715
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
