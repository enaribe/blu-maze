import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="menu" options={{ animation: 'slide_from_left' }} />
            <Stack.Screen name="history" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="add-address" />
            <Stack.Screen name="request-trip" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
    );
}
