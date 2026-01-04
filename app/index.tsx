import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../lib/store';

/**
 * Entry Point Screen
 * Redirects to auth or main app based on authentication status
 */

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Small delay to avoid flash
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

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
