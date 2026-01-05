import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useStore } from '../../lib/store';

/**
 * Unlock Screen
 * Shown when the app is reopened and a session exists
 */

export default function UnlockScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { user } = useStore();

    const handleNumberPress = (num: string) => {
        if (pin.length < 4) {
            setError('');
            const newPin = pin + num;
            setPin(newPin);

            if (newPin.length === 4) {
                // Validate PIN
                // For demo purposes, we accept any 4-digit PIN or "1234" or the user's stored PIN
                // You might want to enforce a specific PIN in a real app
                if (user?.pin && newPin === user.pin) {
                    router.replace('/(main)');
                } else if (!user?.pin) {
                    // If no PIN stored (legacy/demo), allow
                    router.replace('/(main)');
                } else {
                    setError('Incorrect PIN. Please try again.');
                    setPin('');
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    const handleForgotPin = () => {
        Alert.alert('Forgot PIN', 'Please sign in again to reset your PIN', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive', onPress: () => {
                    // Logout logic
                    useStore.getState().logout();
                    router.replace('/(auth)/welcome');
                }
            }
        ])
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color="#666" />
                    </View>
                    <Text style={styles.welcomeText}>Welcome back, {user?.firstName || 'User'}</Text>
                </View>

                <Text style={styles.title}>Enter your PIN</Text>

                {/* PIN Dots */}
                <View style={styles.dotsContainer}>
                    {[0, 1, 2, 3].map((index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                pin.length > index && styles.dotFilled,
                                error ? styles.dotError : null
                            ]}
                        />
                    ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity onPress={handleForgotPin}>
                    <Text style={styles.forgotText}>Forgot PIN?</Text>
                </TouchableOpacity>

                {/* Numeric Keypad */}
                <View style={styles.keypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={styles.key}
                            onPress={() => handleNumberPress(num.toString())}
                        >
                            <Text style={styles.keyText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.key} />
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => handleNumberPress('0')}
                    >
                        <Text style={styles.keyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.key} onPress={handleDelete}>
                        <Text style={styles.deleteText}>⌫</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    welcomeText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '600',
    },
    title: {
        ...Typography.h2,
        color: Colors.text,
        marginBottom: 30,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.textSecondary,
    },
    dotFilled: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    dotError: {
        borderColor: Colors.error,
        backgroundColor: 'transparent',
    },
    errorText: {
        color: Colors.error,
        marginBottom: 20,
        fontSize: 14,
    },
    forgotText: {
        color: Colors.primary,
        marginBottom: 40,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        maxWidth: 320,
    },
    key: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        ...Typography.h1,
        color: Colors.text,
    },
    deleteText: {
        fontSize: 28,
        color: Colors.textSecondary,
    },
});
