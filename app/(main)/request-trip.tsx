import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import { Colors } from '../../constants/Colors';

/**
 * Request Trip Screen
 * Search for destination, recent places, saved addresses
 */

interface SavedAddress {
    icon: string;
    title: string;
    subtitle: string;
    coords?: { latitude: number; longitude: number };
}

export default function RequestTripScreen() {
    const router = useRouter();
    const [pickupAddress] = useState('Kotu Layout');

    // Saved addresses (will come from Firestore later)
    const savedAddresses: SavedAddress[] = [
        {
            icon: 'home',
            title: 'Home',
            subtitle: 'Kairaba Avenue, Serrekunda, Gambia',
            coords: { latitude: 13.4549, longitude: -16.6788 },
        },
        {
            icon: 'briefcase',
            title: 'Office',
            subtitle: 'Westfield Junction, Banjul, Gambia',
            coords: { latitude: 13.4544, longitude: -16.5790 },
        },
    ];

    // Recent destinations (will come from store/Firestore later)
    const recentDestinations: SavedAddress[] = [
        {
            icon: 'time',
            title: 'Traffic Light',
            subtitle: 'Kairaba Avenue, Serrekunda, Gambia',
            coords: { latitude: 13.4423, longitude: -16.6790 },
        },
        {
            icon: 'time',
            title: 'Senegambia Beach',
            subtitle: 'Kololi, Gambia',
            coords: { latitude: 13.4652, longitude: -16.6910 },
        },
    ];

    const handlePlaceSelected = (place: { address: string; coords: { latitude: number; longitude: number } }) => {
        // Navigate back to home with destination data
        router.push({
            pathname: '/(main)',
            params: {
                destination: place.address,
                destLat: place.coords.latitude.toString(),
                destLng: place.coords.longitude.toString(),
            },
        });
    };

    const handleSavedAddressPress = (address: SavedAddress) => {
        if (address.coords) {
            router.push({
                pathname: '/(main)',
                params: {
                    destination: address.title,
                    destLat: address.coords.latitude.toString(),
                    destLng: address.coords.longitude.toString(),
                },
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Request a Trip</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                {/* Input Container */}
                <View style={styles.inputsContainer}>
                    <View style={styles.iconsColumn}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="locate-outline" size={18} color="white" />
                        </View>
                        <View style={styles.verticalLine} />
                        <View style={[styles.iconCircle, { backgroundColor: Colors.primary }]}>
                            <Ionicons name="location" size={18} color="white" />
                        </View>
                    </View>

                    <View style={styles.inputsColumn}>
                        {/* Pickup (read-only) */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={pickupAddress}
                                placeholderTextColor="#666"
                                editable={false}
                            />
                        </View>

                        {/* Destination (autocomplete) */}
                        <View style={styles.inputWrapper}>
                            <PlacesAutocomplete
                                placeholder="Enter destination"
                                onPlaceSelected={handlePlaceSelected}
                                icon="search"
                            />
                        </View>
                    </View>
                </View>

                {/* My Addresses */}
                <Text style={styles.sectionTitle}>My addresses</Text>
                <View style={styles.listContainer}>
                    {savedAddresses.map((address, index) => (
                        <View key={index}>
                            {index > 0 && <View style={styles.divider} />}
                            <ListItem
                                icon={address.icon}
                                title={address.title}
                                subtitle={address.subtitle}
                                onPress={() => handleSavedAddressPress(address)}
                            />
                        </View>
                    ))}
                </View>

                {/* Recent */}
                <Text style={styles.sectionTitle}>Recent</Text>
                <View style={styles.listContainer}>
                    {recentDestinations.map((destination, index) => (
                        <View key={index}>
                            {index > 0 && <View style={styles.divider} />}
                            <ListItem
                                icon={destination.icon}
                                title={destination.title}
                                subtitle={destination.subtitle}
                                onPress={() => handleSavedAddressPress(destination)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ListItem({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.listItem} onPress={onPress}>
            <View style={styles.listIconCircle}>
                <Ionicons name={icon as any} size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{title}</Text>
                <Text style={styles.listSubtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E12',
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
        padding: 20,
    },
    inputsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
        gap: 15,
    },
    iconsColumn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2A2E35',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    verticalLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#444',
        marginVertical: 4,
        minHeight: 20,
    },
    inputsColumn: {
        flex: 1,
        gap: 15,
        justifyContent: 'space-between',
    },
    inputWrapper: {
        minHeight: 40,
        justifyContent: 'center',
    },
    input: {
        color: 'white',
        fontSize: 16,
    },
    sectionTitle: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    listContainer: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        marginBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 15,
    },
    listIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0058D1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    listSubtitle: {
        color: '#AAAAAA',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 70,
    },
});
