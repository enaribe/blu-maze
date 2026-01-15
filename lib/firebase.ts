import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Firebase Services Configuration
 */

// Collections
export const usersCollection = firestore().collection('users');
export const ridesCollection = firestore().collection('rides');
export const driversCollection = firestore().collection('drivers');

// Auth instance
export const firebaseAuth = auth();

// Helper: Get current user ID
export const getCurrentUserId = () => {
    return firebaseAuth.currentUser?.uid || null;
};

// Helper: Check if user is authenticated
export const isUserAuthenticated = () => {
    return firebaseAuth.currentUser !== null;
};

/**
 * Logout User
 * Clears Firebase session and any other related local data if needed
 */
export const logoutUser = async () => {
    try {
        await firebaseAuth.signOut();
        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        return false;
    }
};

/**
 * Rides Management
 */

// Create a new ride
export const createRide = async (rideData: {
    pickup: { address: string; coords: { latitude: number; longitude: number } };
    destination: { address: string; coords: { latitude: number; longitude: number } };
    distance: number;
    duration: number;
    price: number;
    type: 'instant' | 'scheduled';
    scheduledTime?: Date;
    paymentMethod?: 'cash' | 'card';
}) => {
    try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error('User not authenticated');

        const rideDoc = await ridesCollection.add({
            userId,
            status: 'pending',
            type: rideData.type,
            scheduledTime: rideData.scheduledTime || null,
            pickup: {
                label: 'Pickup',
                address: rideData.pickup.address,
                coords: new firestore.GeoPoint(
                    rideData.pickup.coords.latitude,
                    rideData.pickup.coords.longitude
                ),
            },
            destination: {
                label: 'Destination',
                address: rideData.destination.address,
                coords: new firestore.GeoPoint(
                    rideData.destination.coords.latitude,
                    rideData.destination.coords.longitude
                ),
            },
            distance: rideData.distance,
            duration: rideData.duration,
            price: rideData.price,
            paymentMethod: rideData.paymentMethod || 'cash',
            timestamps: {
                created: firestore.FieldValue.serverTimestamp(),
            },
        });

        return { success: true, rideId: rideDoc.id };
    } catch (error) {
        console.error('Error creating ride:', error);
        return { success: false, error };
    }
};

// Get ride by ID
export const getRideById = async (rideId: string) => {
    try {
        const rideDoc = await ridesCollection.doc(rideId).get();
        if (rideDoc.exists) {
            return { ...rideDoc.data(), rideId: rideDoc.id };
        }
        return null;
    } catch (error) {
        console.error('Error getting ride:', error);
        return null;
    }
};

// Get user's active ride (pending, accepted, or in_progress)
export const getUserActiveRide = async (userId?: string) => {
    try {
        const uid = userId || getCurrentUserId();
        if (!uid) return null;

        const snapshot = await ridesCollection
            .where('userId', '==', uid)
            .where('status', 'in', ['pending', 'accepted', 'in_progress'])
            .orderBy('timestamps.created', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const rideDoc = snapshot.docs[0];
        return { ...rideDoc.data(), rideId: rideDoc.id };
    } catch (error) {
        console.error('Error getting active ride:', error);
        return null;
    }
};

// Update ride status
export const updateRideStatus = async (
    rideId: string,
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled',
    additionalData?: any
) => {
    try {
        const updateData: any = { status };

        // Add timestamp based on status
        if (status === 'accepted') {
            updateData['timestamps.accepted'] = firestore.FieldValue.serverTimestamp();
        } else if (status === 'in_progress') {
            updateData['timestamps.started'] = firestore.FieldValue.serverTimestamp();
        } else if (status === 'completed') {
            updateData['timestamps.completed'] = firestore.FieldValue.serverTimestamp();
        }

        // Add any additional data
        if (additionalData) {
            Object.assign(updateData, additionalData);
        }

        await ridesCollection.doc(rideId).update(updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating ride status:', error);
        return { success: false, error };
    }
};

// Listen to ride updates in real-time
export const listenToRide = (rideId: string, callback: (ride: any) => void) => {
    return ridesCollection.doc(rideId).onSnapshot(
        (snapshot) => {
            if (snapshot.exists) {
                callback({ ...snapshot.data(), rideId: snapshot.id });
            }
        },
        (error) => {
            console.error('Error listening to ride:', error);
        }
    );
};

// Cancel ride
export const cancelRide = async (rideId: string) => {
    try {
        await ridesCollection.doc(rideId).update({
            status: 'cancelled',
            'timestamps.cancelled': firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error cancelling ride:', error);
        return { success: false, error };
    }
};

// Add rating to completed ride
export const addRideRating = async (
    rideId: string,
    rating: number,
    comment?: string
) => {
    try {
        await ridesCollection.doc(rideId).update({
            'ratings.passengerRating': rating,
            'ratings.passengerComment': comment || '',
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding rating:', error);
        return { success: false, error };
    }
};

export { auth, firestore };
