/**
 * Send push notification via FCM REST API
 * This is a simple implementation for testing from the web dashboard
 *
 * For production, notifications should be sent from Firebase Cloud Functions
 * for security reasons (server key should not be exposed)
 */

// ⚠️ IMPORTANT: Get your Server Key from Firebase Console
// Firebase Console → Project Settings → Cloud Messaging → Server Key
const FCM_SERVER_KEY = 'YOUR_SERVER_KEY_HERE';

/**
 * Send notification to a specific user
 */
export async function sendNotificationToUser(userId, title, body, data = {}) {
    try {
        // First, get the user's FCM token from Firestore
        const userDoc = await db.collection('users').doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;

        if (!fcmToken) {
            console.error('No FCM token found for user:', userId);
            return { success: false, error: 'No FCM token' };
        }

        // Send notification via FCM REST API
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`,
            },
            body: JSON.stringify({
                to: fcmToken,
                notification: {
                    title,
                    body,
                    sound: 'default',
                },
                data,
                priority: 'high',
            }),
        });

        const result = await response.json();
        console.log('📱 [Notifications] Sent:', result);
        return { success: true, result };
    } catch (error) {
        console.error('📱 [Notifications] Error:', error);
        return { success: false, error };
    }
}

/**
 * Send notification to a topic
 */
export async function sendNotificationToTopic(topic, title, body, data = {}) {
    try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`,
            },
            body: JSON.stringify({
                to: `/topics/${topic}`,
                notification: {
                    title,
                    body,
                    sound: 'default',
                },
                data,
                priority: 'high',
            }),
        });

        const result = await response.json();
        console.log('📱 [Notifications] Sent to topic:', result);
        return { success: true, result };
    } catch (error) {
        console.error('📱 [Notifications] Error:', error);
        return { success: false, error };
    }
}

/**
 * Notification templates for rides
 */
export const RideNotifications = {
    rideAccepted: (driverName) => ({
        title: '🚗 Driver Found!',
        body: `${driverName} accepted your ride and is on the way.`,
    }),

    driverArrived: (driverName) => ({
        title: '📍 Driver Arrived',
        body: `${driverName} is here! Please come out.`,
    }),

    tripStarted: () => ({
        title: '🚀 Trip Started',
        body: 'Your trip has begun. Enjoy the ride!',
    }),

    tripCompleted: (price) => ({
        title: '✅ Trip Completed',
        body: `Your trip is complete. Total: D ${price}`,
    }),

    rideCancelled: () => ({
        title: '❌ Ride Cancelled',
        body: 'Your ride has been cancelled.',
    }),
};
