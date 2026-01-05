import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

/**
 * New Address Screen
 */

export default function AddAddressScreen() {
    const router = useRouter();
    const [address, setAddress] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New address</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="location-outline" size={24} color="white" />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter address"
                        placeholderTextColor="#666"
                        value={address}
                        onChangeText={setAddress}
                        autoFocus
                    />
                </View>
            </View>

            {/* Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E2328',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 60,
        gap: 15,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2E35',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    saveButton: {
        backgroundColor: '#00BFA5',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


