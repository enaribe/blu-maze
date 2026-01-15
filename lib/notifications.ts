import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { usersCollection } from './firebase';

/**
 * Notifications Service
 * Handles Firebase Cloud Messaging (FCM) for push notifications
 */

/**
 * Request notification permissions
 * iOS requires explicit permission, Android auto-grants
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('📱 [Notifications] Authorization status:', authStatus);
                return true;
            }
            console.log('📱 [Notifications] Permission denied');
            return false;
        }

        // Android auto-grants permission
        return true;
    } catch (error) {
        console.error('📱 [Notifications] Error requesting permission:', error);
        return false;
    }
};

/**
 * Get FCM token for this device
 */
export const getFCMToken = async (): Promise<string | null> => {
    try {
        // Check if permission granted
        const hasPermission = await messaging().hasPermission();
        if (hasPermission !== messaging.AuthorizationStatus.AUTHORIZED &&
            hasPermission !== messaging.AuthorizationStatus.PROVISIONAL) {
            console.log('📱 [Notifications] No permission, requesting...');
            const granted = await requestNotificationPermission();
            if (!granted) {
                return null;
            }
        }

        // Get token
        const token = await messaging().getToken();
        console.log('📱 [Notifications] FCM Token:', token);
        return token;
    } catch (error) {
        console.error('📱 [Notifications] Error getting FCM token:', error);
        return null;
    }
};

/**
 * Save FCM token to Firestore for this user
 */
export const saveFCMToken = async (userId: string, token: string): Promise<void> => {
    try {
        await usersCollection.doc(userId).update({
            fcmToken: token,
            updatedAt: new Date(),
        });
        console.log('📱 [Notifications] Token saved to Firestore');
    } catch (error) {
        console.error('📱 [Notifications] Error saving token:', error);
    }
};

/**
 * Listen for token refresh
 * FCM tokens can be refreshed by the system
 */
export const onTokenRefresh = (callback: (token: string) => void) => {
    return messaging().onTokenRefresh((token) => {
        console.log('📱 [Notifications] Token refreshed:', token);
        callback(token);
    });
};

/**
 * Handle foreground notifications
 * Called when app is in foreground and notification arrives
 */
export const onMessageReceived = (callback: (message: any) => void) => {
    return messaging().onMessage(async (remoteMessage) => {
        console.log('📱 [Notifications] Foreground notification:', remoteMessage);
        callback(remoteMessage);
    });
};

/**
 * Handle background notifications
 * Called when app is in background and notification is tapped
 */
export const setBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('📱 [Notifications] Background notification:', remoteMessage);
        // Handle notification (e.g., update badge, local notification)
    });
};

/**
 * Handle notification opened from background/quit state
 */
export const getInitialNotification = async () => {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
        console.log('📱 [Notifications] Notification opened app:', remoteMessage);
        return remoteMessage;
    }
    return null;
};

/**
 * Subscribe to a topic
 * Useful for broadcasting to all users or specific groups
 */
export const subscribeToTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().subscribeToTopic(topic);
        console.log(`📱 [Notifications] Subscribed to topic: ${topic}`);
    } catch (error) {
        console.error('📱 [Notifications] Error subscribing to topic:', error);
    }
};

/**
 * Unsubscribe from a topic
 */
export const unsubscribeFromTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().unsubscribeFromTopic(topic);
        console.log(`📱 [Notifications] Unsubscribed from topic: ${topic}`);
    } catch (error) {
        console.error('📱 [Notifications] Error unsubscribing from topic:', error);
    }
};

/**
 * Send notification to a specific user
 * This is called from the web dashboard or backend
 * Note: For security, this should ideally be done via Cloud Functions
 */
export interface NotificationPayload {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}

/**
 * Initialize notifications for the app
 * Call this once when app starts
 */
export const initializeNotifications = async (userId: string): Promise<void> => {
    try {
        console.log('📱 [Notifications] Initializing...');

        // Request permission
        const granted = await requestNotificationPermission();
        if (!granted) {
            console.log('📱 [Notifications] Permission not granted');
            return;
        }

        // Get FCM token
        const token = await getFCMToken();
        if (token) {
            // Save to Firestore
            await saveFCMToken(userId, token);

            // Subscribe to user-specific topic
            await subscribeToTopic(`user_${userId}`);

            // Subscribe to all users topic (for broadcasts)
            await subscribeToTopic('all_users');
        }

        // Listen for token refresh
        onTokenRefresh(async (newToken) => {
            await saveFCMToken(userId, newToken);
        });

        console.log('📱 [Notifications] Initialization complete');
    } catch (error) {
        console.error('📱 [Notifications] Initialization error:', error);
    }
};

/**
 * Types for notification data
 */
export enum NotificationType {
    RIDE_ACCEPTED = 'ride_accepted',
    DRIVER_ARRIVED = 'driver_arrived',
    TRIP_STARTED = 'trip_started',
    TRIP_COMPLETED = 'trip_completed',
    RIDE_CANCELLED = 'ride_cancelled',
}

export interface RideNotificationData {
    type: NotificationType;
    rideId: string;
    driverName?: string;
    driverId?: string;
}
