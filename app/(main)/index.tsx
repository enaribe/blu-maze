import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get('window');

/**
 * Home Screen - Main map view for ordering rides
 */

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const step = params.step as string || 'initial'; // initial, preview, connecting

    // State for initial view
    const [rideType, setRideType] = useState<'instant' | 'scheduled'>('instant');
    const [pickup, setPickup] = useState('My current position');
    const [destination, setDestination] = useState('');

    // State for connecting view
    const [isConnecting, setIsConnecting] = useState(false);

    // Derived state overrides if step is connecting (simulating local state transition)
    const currentStep = isConnecting ? 'connecting' : step;

    const handleOrderRide = () => {
        setIsConnecting(true);
        // In real app, triggering this would start a socket connection or polling
    };

    const handleCancelOrder = () => {
        setIsConnecting(false);
        router.setParams({ step: 'initial' });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Map Mock Background */}
            <View style={styles.mapContainer}>
                <View style={styles.mapMock}>
                    {/* ... (landmarks) ... */}
                    <View style={[styles.landmark, { top: '15%', left: '10%' }]}>
                        <View style={styles.landmarkPin}><Ionicons name="bed" size={14} color="white" /></View>
                        <Text style={styles.landmarkText}>Kombo Beach Resort</Text>
                    </View>
                    <View style={[styles.landmark, { top: '35%', left: '40%' }]}>
                        <View style={styles.landmarkPin}><Ionicons name="bed" size={14} color="white" /></View>
                        <Text style={styles.landmarkText}>Tamala Beach Resort</Text>
                    </View>
                    <View style={[styles.landmark, { top: '55%', left: '15%' }]}>
                        <View style={styles.landmarkPin}><Ionicons name="bed" size={14} color="white" /></View>
                        <Text style={styles.landmarkText}>African Princess Beach Hotel</Text>
                    </View>

                    {/* Show Route Line if Preview or Connecting */}
                    {['preview', 'connecting'].includes(currentStep) && (
                        <>
                            {/* Mock Route Line */}
                            <View style={{ position: 'absolute', top: '40%', left: '30%', width: 100, height: 2, backgroundColor: Colors.primary, transform: [{ rotate: '45deg' }] }} />
                            {/* Destination Pin */}
                            <View style={[styles.landmark, { top: '52%', left: '55%' }]}>
                                <Ionicons name="location" size={30} color={Colors.primary} />
                            </View>
                        </>
                    )}
                </View>
            </View>

            {/* Top Overlay - Current Position (Hide when connecting?) */}
            {currentStep !== 'connecting' && (
                <SafeAreaView style={styles.topOverlay}>
                    <View style={styles.topInfoBar}>
                        <View style={styles.locationInfo}>
                            <Text style={styles.myPositionText}>My position {'>'}</Text>
                            <Text style={styles.currentLocationText}>Kotu Layout</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => router.push('/(main)/menu')}
                        >
                            <Ionicons name="menu" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}

            {/* Bottom Sheet - Dynamic Content */}
            <View style={[styles.bottomSheet, currentStep === 'connecting' && styles.bottomSheetConnecting]}>

                {/* 1. Initial State */}
                {currentStep === 'initial' && (
                    <>
                        <View style={styles.handle} />
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    rideType === 'instant' && styles.activeTabBlue,
                                ]}
                                onPress={() => setRideType('instant')}
                            >
                                <Text style={styles.tabText}>Instant ride</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    rideType === 'scheduled' && styles.activeTabDark,
                                ]}
                                onPress={() => setRideType('scheduled')}
                            >
                                <Text style={styles.tabText}>Schedule ride</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.destinationHeader}>
                            <Text style={styles.destinationTitle}>Set your destination</Text>
                            <View style={styles.titleUnderline} />
                        </View>

                        <View style={styles.inputSection}>
                            <View style={styles.iconsColumn}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="locate-outline" size={18} color="white" />
                                </View>
                                <View style={styles.verticalLine} />
                                <View style={[styles.iconCircle, { backgroundColor: '#00BFA5' }]}>
                                    <Ionicons name="location" size={18} color="white" />
                                </View>
                            </View>

                            <View style={styles.inputsColumn}>
                                <TouchableOpacity style={styles.inputWrapper} onPress={() => { }}>
                                    <Text style={styles.inputText}>{pickup}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.inputWrapper}
                                    onPress={() => router.push('/(main)/request-trip')}
                                >
                                    <Text style={styles.inputPlaceholder}>{destination || "Enter destination"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.orderButton} onPress={() => { }}>
                                <Text style={styles.orderButtonText}>Order ride</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* 2. Preview State (Your Trip) */}
                {currentStep === 'preview' && (
                    <>
                        <View style={styles.handle} />
                        <Text style={styles.sheetTitle}>Your Trip</Text>
                        <View style={styles.divider} />

                        <View style={styles.tripSummary}>
                            <View style={styles.iconsColumn}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="locate-outline" size={18} color="white" />
                                </View>
                                <View style={styles.verticalLine} />
                                <View style={[styles.iconCircle, { backgroundColor: '#00BFA5' }]}>
                                    <Ionicons name="location" size={18} color="white" />
                                </View>
                            </View>
                            <View style={styles.inputsColumn}>
                                <View style={styles.readOnlyInput}>
                                    <Text style={styles.inputText}>Kotu Layout</Text>
                                </View>
                                <View style={styles.readOnlyInput}>
                                    <Text style={styles.inputText}>Traffic Light</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.paymentRow}>
                            <View style={styles.cardInfo}>
                                <Ionicons name="card" size={20} color="#666" />
                                <Text style={styles.cardText}>Card</Text>
                            </View>
                            <Text style={styles.priceText}>D 100.00</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.orderButton} onPress={handleOrderRide}>
                                <Text style={styles.orderButtonText}>Order ride</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* 3. Connecting State */}
                {currentStep === 'connecting' && (
                    <>
                        <View style={styles.handle} />
                        <Text style={styles.connectingTitle}>We are connecting you to a driver...</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressBarBg}>
                            <View style={styles.progressBarFill} />
                        </View>

                        <View style={styles.connectingRoute}>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}><Ionicons name="locate-outline" size={14} color="white" /></View>
                                <Text style={styles.routeText}>Kotu Layout</Text>
                            </View>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}><Ionicons name="location" size={14} color="white" /></View>
                                <Text style={styles.routeText}>Traffic Light</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                            <View style={styles.cancelIcon}>
                                <Ionicons name="close" size={24} color="#0A0E12" />
                            </View>
                            <Text style={styles.cancelText}>Cancel order</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>
        </View>
    );
}

// Check imports
import { Colors } from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    mapMock: {
        flex: 1,
        backgroundColor: '#1B262C',
    },
    landmark: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    landmarkPin: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#A020F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    landmarkText: {
        color: '#FF69B4',
        fontSize: 12,
        fontWeight: '600',
    },
    topOverlay: {
        position: 'absolute',
        top: 40,
        width: '100%',
        zIndex: 10,
        paddingHorizontal: 16,
    },
    topInfoBar: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    locationInfo: {
        flex: 1,
        alignItems: 'center',
    },
    myPositionText: {
        color: '#AAAAAA',
        fontSize: 12,
        marginBottom: 4,
    },
    currentLocationText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuButton: {
        padding: 4,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#0A0E12',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 20,
    },
    handle: {
        width: 60,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E2328',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabBlue: {
        backgroundColor: '#0058D1',
    },
    activeTabDark: {
        backgroundColor: 'transparent',
    },
    tabText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    destinationHeader: {
        marginBottom: 24,
    },
    destinationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    titleUnderline: {
        width: '100%',
        height: 1,
        backgroundColor: '#333',
    },
    inputSection: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 15,
    },
    iconsColumn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2A2E35',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    verticalLine: {
        width: 2,
        height: 40,
        backgroundColor: '#444',
    },
    inputsColumn: {
        flex: 1,
        gap: 15,
    },
    locationInput: {
        backgroundColor: '#1E2328',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        color: 'white',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 10,
    },
    orderButton: {
        backgroundColor: '#00BFA5',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // New Styles
    inputWrapper: {
        backgroundColor: '#1E2328',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    inputText: {
        color: 'white',
        fontSize: 16,
    },
    inputPlaceholder: {
        color: '#666',
        fontSize: 16,
    },
    bottomSheetConnecting: {
        alignItems: 'center',
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginBottom: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#333',
        marginBottom: 20
    },
    tripSummary: {
        flexDirection: 'row',
        width: '100%',
        gap: 15,
        marginBottom: 20,
    },
    readOnlyInput: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        width: '100%',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#1E2328',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    priceText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    connectingTitle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    progressBarBg: {
        width: '100%',
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        marginBottom: 30,
    },
    progressBarFill: {
        width: '30%',
        height: '100%',
        backgroundColor: '#0058D1',
        borderRadius: 2,
    },
    connectingRoute: {
        width: '100%',
        gap: 20,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    dotOutline: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    cancelIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1E2328',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        color: '#AAAAAA',
        fontSize: 14,
    },
});
