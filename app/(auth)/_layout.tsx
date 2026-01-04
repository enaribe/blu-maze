import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

/**
 * Authentication Flow Layout
 * Stack navigator for onboarding and authentication screens
 */

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="pin" />
      <Stack.Screen name="pin-confirm" />
    </Stack>
  );
}
