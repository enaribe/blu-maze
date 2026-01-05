import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

/**
 * My Addresses Screen
 */

export default function AddressesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My addresses</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Globe Mockup */}
                <View style={styles.imageContainer}>
                    <Ionicons name="globe-outline" size={150} color="#0058D1" />
                    <View style={styles.pinOverlay}>
                        <Ionicons name="location" size={40} color="#FF3B30" />
                    </View>
                </View>

                <Text style={styles.subtitle}>
                    Add your addresses to request a ride faster and more conveniently.
                </Text>

                {/* Buttons */}
                <View style={styles.buttonGroup}>
                    <AddressTypeButton
                        icon="home-outline"
                        label="Add Home"
                        onPress={() => router.push('/(main)/add-address')}
                    />
                    <AddressTypeButton
                        icon="briefcase-outline"
                        label="Add Work"
                        onPress={() => router.push('/(main)/add-address')}
                    />
                    <AddressTypeButton
                        icon="heart-outline"
                        label="Add Favorite"
                        onPress={() => router.push('/(main)/add-address')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

function AddressTypeButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.addressButton} onPress={onPress}>
            <Ionicons name={icon} size={20} color="white" />
            <Text style={styles.addressButtonText}>{label}</Text>
        </TouchableOpacity>
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
        alignItems: 'center',
        padding: 24,
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: 40,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinOverlay: {
        position: 'absolute',
        top: 30,
        right: 30,
    },
    subtitle: {
        color: '#AAAAAA',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    buttonGroup: {
        width: '100%',
        gap: 15,
    },
    addressButton: {
        backgroundColor: '#0058D1',
        flexDirection: 'row',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    addressButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
