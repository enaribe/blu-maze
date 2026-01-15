import auth from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Colors } from "../constants/Colors";
import { usersCollection } from "../lib/firebase";
import { initializeNotifications, onMessageReceived } from "../lib/notifications";
import { useStore } from "../lib/store";
import { Alert } from "react-native";

export default function RootLayout() {
  const { setUser, logout } = useStore();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        try {
          // Fetch additional data from Firestore
          const userDoc = await usersCollection.doc(firebaseUser.uid).get();

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              phoneNumber: firebaseUser.phoneNumber || '',
              firstName: userData?.firstName || '',
              lastName: userData?.lastName || '',
              email: userData?.email,
              profilePhoto: userData?.profilePhoto,
              pin: userData?.pin,
            });

            // Initialize notifications for this user (skip if not available natively)
            try {
              await initializeNotifications(firebaseUser.uid);
            } catch (error) {
              console.log('⚠️ [Notifications] Skipped (rebuild required):', error);
            }
          } else {
            // User exists in Auth but not in Firestore yet (e.g. middle of signup)
            // We just ensure the common fields are set if possible
            setUser({
              id: firebaseUser.uid,
              phoneNumber: firebaseUser.phoneNumber || '',
              firstName: '',
              lastName: '',
            });
          }
        } catch (error) {
          console.error("Error syncing user data from Firestore:", error);
        }
      } else {
        // User is logged out
        logout();
      }
    });

    return unsubscribe;
  }, []);

  // Listen for foreground notifications (skip if not available natively)
  useEffect(() => {
    try {
      const unsubscribe = onMessageReceived((message) => {
        // Show alert when notification received in foreground
        Alert.alert(
          message.notification?.title || 'New Notification',
          message.notification?.body || '',
        );
      });

      return unsubscribe;
    } catch (error) {
      console.log('⚠️ [Notifications] Listener skipped (rebuild required)');
      return () => {}; // Return empty cleanup function
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "fade",
        }}
      />
    </>
  );
}
