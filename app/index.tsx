import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../lib/store';

/**
 * Entry Point Screen
 * Redirects to auth or main app based on authentication status
 */

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useStore();

  useEffect(() => {
    // Small delay to avoid flash
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // If authenticated, go to unlock screen (requiring PIN)
        // rather than directly to main app
        router.replace('/(auth)/unlock');
      } else if (!hasCompletedOnboarding) {
        // If first time, go to onboarding
        router.replace('/(auth)/onboarding');
      } else {
        // If previously onboarded but not logged in, go to welcome/login
        router.replace('/(auth)/welcome');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
