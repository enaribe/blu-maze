import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Map from '../../components/Map';
import { Colors } from '../../constants/Colors';
import { cancelRide, createRide, getUserActiveRide, listenToRide } from '../../lib/firebase';
import { getDirections, reverseGeocode } from '../../lib/maps';

const { height, width } = Dimensions.get('window');

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface PlaceData {
  address: string;
  coords: LocationCoords;
}

/**
 * Home Screen - Main map view for ordering rides
 */

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Ride type
    const [rideType, setRideType] = useState<'instant' | 'scheduled'>('instant');

    // Locations
    const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
    const [pickupLocation, setPickupLocation] = useState<PlaceData | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<PlaceData | null>(null);

    // Route data
    const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // UI state
    const [step, setStep] = useState<'initial' | 'preview' | 'connecting' | 'active'>('initial');
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(true);

    // Active ride
    const [currentRideId, setCurrentRideId] = useState<string | null>(null);
    const [rideStatus, setRideStatus] = useState<string | null>(null);
    const [driverLocation, setDriverLocation] = useState<LocationCoords | null>(null);

    // Get user's current location on mount
    useEffect(() => {
        console.log('🏠 [HomeScreen] Component mounted, getting location...');
        getCurrentLocation();
    }, []);

    // Debug log when markers or route change
    useEffect(() => {
        console.log('🏠 [HomeScreen] ===== Map data updated =====');
        console.log('🏠 [HomeScreen] Markers count:', markers.length);
        console.log('🏠 [HomeScreen] Route coordinates count:', routeCoordinates.length);
        console.log('🏠 [HomeScreen] Route coordinates details:', {
            length: routeCoordinates.length,
            isEmpty: routeCoordinates.length === 0,
            hasOnePoint: routeCoordinates.length === 1,
            hasMultiplePoints: routeCoordinates.length > 1,
            firstPoint: routeCoordinates.length > 0 ? routeCoordinates[0] : null,
            lastPoint: routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null,
        });
        console.log('🏠 [HomeScreen] User location:', userLocation);
        console.log('🏠 [HomeScreen] Loading location:', loadingLocation);
        console.log('🏠 [HomeScreen] ===== End map data update =====');
    }, [markers, routeCoordinates, userLocation, loadingLocation]);

    // Check for active ride on mount
    useEffect(() => {
        checkActiveRide();
    }, []);

    // Listen to ride updates
    useEffect(() => {
        if (!currentRideId) return;

        const unsubscribe = listenToRide(currentRideId, (ride) => {
            setRideStatus(ride.status);

            // Update driver location if available
            if (ride.driverLocation) {
                setDriverLocation({
                    latitude: ride.driverLocation.latitude,
                    longitude: ride.driverLocation.longitude,
                });
            }

            // Update UI based on ride status
            if (ride.status === 'pending') {
                setStep('connecting');
            } else if (ride.status === 'accepted' || ride.status === 'in_progress') {
                setStep('active');
            } else if (ride.status === 'completed') {
                // Navigate to rating screen
                router.push({
                    pathname: '/(main)/rate-ride',
                    params: { rideId: currentRideId },
                });
                setCurrentRideId(null);
                setDriverLocation(null);
                setStep('initial');
            } else if (ride.status === 'cancelled') {
                setCurrentRideId(null);
                setDriverLocation(null);
                setStep('initial');
                Alert.alert('Ride Cancelled', 'Your ride has been cancelled.');
            }
        });

        return () => unsubscribe();
    }, [currentRideId]);

    // Handle destination from request-trip screen
    useEffect(() => {
        console.log('🏠 [HomeScreen] ===== useEffect destination params =====');
        console.log('🏠 [HomeScreen] params.destination:', params.destination);
        console.log('🏠 [HomeScreen] params.destLat:', params.destLat);
        console.log('🏠 [HomeScreen] params.destLng:', params.destLng);
        console.log('🏠 [HomeScreen] pickupLocation:', pickupLocation);
        
        if (params.destination && params.destLat && params.destLng && pickupLocation) {
            console.log('🏠 [HomeScreen] ✅ All conditions met, processing destination...');
            
            const destCoords = {
                latitude: parseFloat(params.destLat as string),
                longitude: parseFloat(params.destLng as string),
            };
            
            console.log('🏠 [HomeScreen] Destination coordinates:', destCoords);
            console.log('🏠 [HomeScreen] Current destinationLocation:', destinationLocation);

            // Only update if destination actually changed
            if (!destinationLocation ||
                destinationLocation.coords.latitude !== destCoords.latitude ||
                destinationLocation.coords.longitude !== destCoords.longitude) {
                
                console.log('🏠 [HomeScreen] ✅ Destination changed, updating and calculating route...');
                
                setDestinationLocation({
                    address: params.destination as string,
                    coords: destCoords,
                });

                console.log('🏠 [HomeScreen] Calling calculateRoute with:');
                console.log('🏠 [HomeScreen] - Origin:', pickupLocation.coords);
                console.log('🏠 [HomeScreen] - Destination:', destCoords);
                calculateRoute(pickupLocation.coords, destCoords);
            } else {
                console.log('🏠 [HomeScreen] ⚠️ Destination unchanged, skipping route calculation');
            }
        } else {
            console.log('🏠 [HomeScreen] ⚠️ Missing required params or pickupLocation');
            console.log('🏠 [HomeScreen] - params.destination exists:', !!params.destination);
            console.log('🏠 [HomeScreen] - params.destLat exists:', !!params.destLat);
            console.log('🏠 [HomeScreen] - params.destLng exists:', !!params.destLng);
            console.log('🏠 [HomeScreen] - pickupLocation exists:', !!pickupLocation);
        }
        console.log('🏠 [HomeScreen] ===== End useEffect destination params =====');
    }, [params.destination, params.destLat, params.destLng, pickupLocation]);

    const checkActiveRide = async () => {
        try {
            const activeRide = await getUserActiveRide();
            if (activeRide) {
                setCurrentRideId(activeRide.rideId);
                setRideStatus(activeRide.status);

                // Set pickup and destination from active ride
                if (activeRide.pickup) {
                    setPickupLocation({
                        address: activeRide.pickup.address,
                        coords: {
                            latitude: activeRide.pickup.coords.latitude,
                            longitude: activeRide.pickup.coords.longitude,
                        },
                    });
                }
                if (activeRide.destination) {
                    setDestinationLocation({
                        address: activeRide.destination.address,
                        coords: {
                            latitude: activeRide.destination.coords.latitude,
                            longitude: activeRide.destination.coords.longitude,
                        },
                    });
                }

                // Set other ride data
                setDistance(activeRide.distance || 0);
                setDuration(activeRide.duration || 0);
                setPrice(activeRide.price || 0);

                // Set UI state based on ride status
                if (activeRide.status === 'pending') {
                    setStep('connecting');
                } else if (activeRide.status === 'accepted' || activeRide.status === 'in_progress') {
                    setStep('active');
                }
            }
        } catch (error) {
            console.error('Error checking active ride:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            console.log('🏠 [HomeScreen] Requesting location permissions...');
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log('🏠 [HomeScreen] Location permission status:', status);

            if (status !== 'granted') {
                console.warn('🏠 [HomeScreen] ⚠️ Permission denied');
                setLoadingLocation(false);
                return;
            }

            console.log('🏠 [HomeScreen] Getting current position...');
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            console.log('🏠 [HomeScreen] ✅ Location obtained:', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
            });

            const coords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setUserLocation(coords);

            // Get address for current location
            console.log('🏠 [HomeScreen] Reverse geocoding address...');
            const address = await reverseGeocode(coords);
            console.log('🏠 [HomeScreen] Address:', address);

            setPickupLocation({
                address: address || 'Current location',
                coords,
            });

            console.log('🏠 [HomeScreen] Setting loadingLocation to false');
            setLoadingLocation(false);
        } catch (error) {
            console.error('🏠 [HomeScreen] ❌ Error getting location:', error);
            setLoadingLocation(false);
        }
    };

    const calculateRoute = async (origin: LocationCoords, destination: LocationCoords) => {
        console.log('🏠 [HomeScreen] ===== calculateRoute called =====');
        console.log('🏠 [HomeScreen] Origin:', origin);
        console.log('🏠 [HomeScreen] Destination:', destination);
        
        setLoading(true);
        try {
            console.log('🏠 [HomeScreen] Calling getDirections...');
            const result = await getDirections(origin, destination);
            console.log('🏠 [HomeScreen] getDirections returned:', result ? 'SUCCESS' : 'NULL');

            if (result) {
                console.log('🏠 [HomeScreen] ✅ Route result received:');
                console.log('🏠 [HomeScreen] - Distance:', result.distance, 'km');
                console.log('🏠 [HomeScreen] - Duration:', result.duration, 'min');
                console.log('🏠 [HomeScreen] - Price:', result.price);
                console.log('🏠 [HomeScreen] - Route points count:', result.route.length);
                
                if (result.route.length > 0) {
                    console.log('🏠 [HomeScreen] - First route point:', result.route[0]);
                    console.log('🏠 [HomeScreen] - Last route point:', result.route[result.route.length - 1]);
                } else {
                    console.error('🏠 [HomeScreen] ❌ ERROR: Route array is empty!');
                }
                
                console.log('🏠 [HomeScreen] Setting routeCoordinates...');
                setRouteCoordinates(result.route);
                setDistance(result.distance);
                setDuration(result.duration);
                setPrice(result.price);
                setStep('preview');
                
                console.log('🏠 [HomeScreen] ✅ Route state updated, step set to preview');
            } else {
                console.error('🏠 [HomeScreen] ❌ ERROR: getDirections returned null!');
                Alert.alert('Error', 'Could not calculate route. Please check your locations and try again.');
            }
        } catch (error) {
            console.error('🏠 [HomeScreen] ❌ EXCEPTION in calculateRoute:', error);
            console.error('🏠 [HomeScreen] Error details:', JSON.stringify(error, null, 2));
            Alert.alert('Error', 'Failed to calculate route. Please try again.');
        } finally {
            setLoading(false);
            console.log('🏠 [HomeScreen] ===== calculateRoute finished =====');
        }
    };

    const handleOrderRide = async () => {
        if (!pickupLocation || !destinationLocation) {
            Alert.alert('Error', 'Please select pickup and destination locations');
            return;
        }

        setLoading(true);
        try {
            const result = await createRide({
                pickup: pickupLocation,
                destination: destinationLocation,
                distance,
                duration,
                price,
                type: rideType,
                paymentMethod: 'cash',
            });

            if (result.success && result.rideId) {
                setCurrentRideId(result.rideId);
                setStep('connecting');
            } else {
                Alert.alert('Error', 'Failed to create ride. Please try again.');
            }
        } catch (error) {
            console.error('Error ordering ride:', error);
            Alert.alert('Error', 'Failed to create ride. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (currentRideId) {
            const result = await cancelRide(currentRideId);
            if (result.success) {
                setCurrentRideId(null);
                setStep('initial');
                setDestinationLocation(null);
                setRouteCoordinates([]);
            } else {
                Alert.alert('Error', 'Failed to cancel ride. Please try again.');
            }
        } else {
            setStep('initial');
            setDestinationLocation(null);
            setRouteCoordinates([]);
        }
    };

    const handleBack = () => {
        setStep('initial');
        setDestinationLocation(null);
        setRouteCoordinates([]);
    };

    // Prepare markers for map (memoized to prevent re-renders)
    const markers = useMemo(() => {
        const markersList = [];
        if (pickupLocation) {
            markersList.push({
                coordinate: pickupLocation.coords,
                title: 'Pickup',
                description: pickupLocation.address,
            });
        }
        if (destinationLocation) {
            markersList.push({
                coordinate: destinationLocation.coords,
                title: 'Destination',
                description: destinationLocation.address,
            });
        }
        if (driverLocation && step === 'active') {
            markersList.push({
                coordinate: driverLocation,
                title: 'Driver',
                description: rideStatus === 'accepted' ? 'Driver is on the way' : 'Driver',
                color: '#00D9D5', // Blu Maze primary color for driver
            });
        }
        return markersList;
    }, [pickupLocation, destinationLocation, driverLocation, step, rideStatus]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Real Google Map */}
            <View style={styles.mapContainer}>
                {loadingLocation ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Loading map...</Text>
                    </View>
                ) : (
                    <Map
                        showUserLocation={true}
                        markers={markers}
                        route={routeCoordinates}
                        initialRegion={userLocation ? {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        } : undefined}
                        onMapReady={() => {
                            console.log('🏠 [HomeScreen] ✅ Map ready callback received');
                            console.log('🏠 [HomeScreen] At map ready, routeCoordinates.length:', routeCoordinates.length);
                        }}
                    />
                )}
            </View>

            {/* Top Overlay - Current Position */}
            {step !== 'connecting' && !loadingLocation && (
                <SafeAreaView style={styles.topOverlay}>
                    <View style={styles.topInfoBar}>
                        <View style={styles.locationInfo}>
                            <Text style={styles.myPositionText}>My position {'>'}</Text>
                            <Text style={styles.currentLocationText} numberOfLines={1}>
                                {pickupLocation?.address || 'Getting location...'}
                            </Text>
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

            {/* Back Button (Preview state) */}
            {step === 'preview' && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            )}

            {/* Bottom Sheet - Dynamic Content */}
            <View style={[styles.bottomSheet, step === 'connecting' && styles.bottomSheetConnecting]}>

                {/* 1. Initial State - Destination Selection */}
                {step === 'initial' && (
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
                                <View style={[styles.iconCircle, { backgroundColor: Colors.primary }]}>
                                    <Ionicons name="location" size={18} color="white" />
                                </View>
                            </View>

                            <View style={styles.inputsColumn}>
                                {/* Pickup (read-only) */}
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputText} numberOfLines={1}>
                                        {pickupLocation?.address || 'Getting location...'}
                                    </Text>
                                </View>

                                {/* Destination (clickable - opens request-trip) */}
                                <TouchableOpacity
                                    style={styles.inputWrapper}
                                    onPress={() => router.push('/(main)/request-trip')}
                                >
                                    <Text style={styles.inputPlaceholder}>
                                        {destinationLocation?.address || 'Enter destination'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {loading && (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                                <Text style={styles.loadingText}>Calculating route...</Text>
                            </View>
                        )}
                    </>
                )}

                {/* 2. Preview State - Trip Details */}
                {step === 'preview' && (
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
                                <View style={[styles.iconCircle, { backgroundColor: Colors.primary }]}>
                                    <Ionicons name="location" size={18} color="white" />
                                </View>
                            </View>
                            <View style={styles.inputsColumn}>
                                <View style={styles.readOnlyInput}>
                                    <Text style={styles.inputText} numberOfLines={1}>
                                        {pickupLocation?.address}
                                    </Text>
                                </View>
                                <View style={styles.readOnlyInput}>
                                    <Text style={styles.inputText} numberOfLines={1}>
                                        {destinationLocation?.address}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Trip Info */}
                        <View style={styles.tripInfo}>
                            <View style={styles.tripInfoItem}>
                                <Ionicons name="car" size={20} color={Colors.textSecondary} />
                                <Text style={styles.tripInfoText}>{distance.toFixed(1)} km</Text>
                            </View>
                            <View style={styles.tripInfoItem}>
                                <Ionicons name="time" size={20} color={Colors.textSecondary} />
                                <Text style={styles.tripInfoText}>{Math.round(duration)} min</Text>
                            </View>
                        </View>

                        <View style={styles.paymentRow}>
                            <View style={styles.cardInfo}>
                                <Ionicons name="card" size={20} color="#666" />
                                <Text style={styles.cardText}>Cash</Text>
                            </View>
                            <Text style={styles.priceText}>D {price.toFixed(2)}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.orderButton} onPress={handleOrderRide}>
                                <Text style={styles.orderButtonText}>Order ride</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* 3. Connecting State - Finding Driver */}
                {step === 'connecting' && (
                    <>
                        <View style={styles.handle} />
                        <Text style={styles.connectingTitle}>We are connecting you to a driver...</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressBarBg}>
                            <View style={styles.progressBarFill} />
                        </View>

                        <View style={styles.connectingRoute}>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}>
                                    <Ionicons name="locate-outline" size={14} color="white" />
                                </View>
                                <Text style={styles.routeText} numberOfLines={1}>
                                    {pickupLocation?.address}
                                </Text>
                            </View>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}>
                                    <Ionicons name="location" size={14} color="white" />
                                </View>
                                <Text style={styles.routeText} numberOfLines={1}>
                                    {destinationLocation?.address}
                                </Text>
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

                {/* 4. Active State - Driver Accepted / In Progress */}
                {step === 'active' && (
                    <>
                        <View style={styles.handle} />
                        <Text style={styles.sheetTitle}>
                            {rideStatus === 'accepted' ? 'Driver is on the way' : 'Trip in progress'}
                        </Text>
                        <View style={styles.divider} />

                        {/* Driver Info (Mock - will be real in driver app) */}
                        <View style={styles.driverCard}>
                            <View style={styles.driverAvatar}>
                                <Ionicons name="person" size={32} color="white" />
                            </View>
                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>Driver Name</Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>4.9</Text>
                                </View>
                                <Text style={styles.vehicleText}>Toyota Corolla • ABC 123</Text>
                            </View>
                            <View style={styles.driverActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="call" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="chatbubble" size={24} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Trip Info */}
                        <View style={styles.activeRoute}>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}>
                                    <Ionicons name="locate-outline" size={14} color="white" />
                                </View>
                                <Text style={styles.routeText} numberOfLines={1}>
                                    {pickupLocation?.address}
                                </Text>
                            </View>
                            <View style={styles.routeRow}>
                                <View style={styles.dotOutline}>
                                    <Ionicons name="location" size={14} color="white" />
                                </View>
                                <Text style={styles.routeText} numberOfLines={1}>
                                    {destinationLocation?.address}
                                </Text>
                            </View>
                        </View>

                        {/* Trip Stats */}
                        <View style={styles.tripInfo}>
                            <View style={styles.tripInfoItem}>
                                <Ionicons name="car" size={20} color={Colors.textSecondary} />
                                <Text style={styles.tripInfoText}>{distance.toFixed(1)} km</Text>
                            </View>
                            <View style={styles.tripInfoItem}>
                                <Ionicons name="time" size={20} color={Colors.textSecondary} />
                                <Text style={styles.tripInfoText}>{Math.round(duration)} min</Text>
                            </View>
                            <View style={styles.tripInfoItem}>
                                <Ionicons name="cash" size={20} color={Colors.textSecondary} />
                                <Text style={styles.tripInfoText}>D {price.toFixed(2)}</Text>
                            </View>
                        </View>

                        {rideStatus === 'accepted' && (
                            <TouchableOpacity style={styles.cancelButtonAlt} onPress={handleCancelOrder}>
                                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#1B262C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 12,
        fontSize: 14,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginVertical: 16,
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 10,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuButton: {
        padding: 4,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        zIndex: 10,
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
    bottomSheetConnecting: {
        alignItems: 'center',
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
        marginBottom: 20,
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
    buttonContainer: {
        marginTop: 10,
    },
    orderButton: {
        backgroundColor: Colors.primary,
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
        marginBottom: 20,
    },
    tripSummary: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15,
    },
    readOnlyInput: {
        backgroundColor: '#1E2328',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    tripInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingVertical: 12,
        backgroundColor: '#1E2328',
        borderRadius: 12,
    },
    tripInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tripInfoText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#1E2328',
        borderRadius: 12,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardText: {
        color: Colors.text,
        fontSize: 16,
    },
    priceText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
    },
    connectingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        marginBottom: 30,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        width: '60%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    connectingRoute: {
        width: '100%',
        marginBottom: 30,
        gap: 16,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    dotOutline: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeText: {
        flex: 1,
        color: Colors.text,
        fontSize: 16,
    },
    cancelButton: {
        alignItems: 'center',
        gap: 12,
    },
    cancelIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        gap: 15,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    ratingText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    vehicleText: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    driverActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 88, 209, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeRoute: {
        marginBottom: 20,
        gap: 16,
    },
    cancelButtonAlt: {
        backgroundColor: '#FF4444',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
