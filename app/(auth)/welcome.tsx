import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button } from '../../components/ui';

/**
 * Welcome Screen - First screen users see
 */

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* TODO: Replace with actual Blu Maze logo */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>BLU MAZE</Text>
        </View>
        <Text style={styles.tagline}>Bespoke Chauffeuring</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/onboarding')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  tagline: {
    ...Typography.body,
    color: Colors.primary,
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
