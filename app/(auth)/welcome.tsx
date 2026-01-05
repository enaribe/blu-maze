import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

/**
 * Welcome Screen - First screen users see
 */

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to onboarding after a delay (optional, as per common "splash-like" welcome screens)
    // Or just let the user tap. In the design it looks like a splash/intro screen.
    // Let's make the whole screen tappable or just wait.
    // Given the design shows "Welcome" at the top left, maybe it's just a transition.
    // For now, I'll add a timeout to automatically go to Onboarding, 
    // or we can wrap it in a Pressable.
    // The previous implementation had a button. The new design doesn't explicitly show a button on the "Welcome" screen
    // (the first image in the second row looks like the welcome screen).
    // Actually, looking at the user images:
    // Image 1: "Welcome" text top left. Logo center. Tagline "Bespoke Chauffeuring". No visible buttons.
    // Image 2: "First visit". Logo top. Slide 1 (Safe). Login/Sign up buttons.
    // So the Welcome screen might just be a splash or tap to continue.

    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logosplash.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Bespoke Chauffeuring</Text>
        </View>
      </View>
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
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: 200, // Adjust size as needed based on the png
    height: 200,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: Colors.primary, // Teal color
    letterSpacing: 0.5,
  },
});
