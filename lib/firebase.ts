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

export { auth, firestore };
