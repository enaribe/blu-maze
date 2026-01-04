import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button } from '../../components/ui';

/**
 * Onboarding Screen
 * Shows carousel with app benefits: Safe, Reliable, Efficient
 * TODO: Add carousel component in future iteration
 */

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* TODO: Add carousel with images */}
        <View style={styles.carousel}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>🚗</Text>
          </View>
          <Text style={styles.title}>Safe & Reliable</Text>
          <Text style={styles.description}>
            Professional drivers with verified credentials and high safety standards
          </Text>
        </View>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => router.push('/(auth)/phone')}
        />
        <Button
          title="Skip"
          variant="outline"
          onPress={() => router.push('/(auth)/phone')}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
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
    justifyContent: 'center',
  },
  carousel: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  iconPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: Colors.card,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconText: {
    fontSize: 80,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
