import "react-native-gesture-handler";
import "react-native-get-random-values";
import "react-native-reanimated";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { registerForPushNotificationsAsync, setupNotificationListeners, cleanupPushToken } from '@/services/notificationService';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
  const { isSignedIn, userId } = useAuth();
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let currentToken: string | null = null;

    const setupPushNotifications = async () => {
      console.log('Setting up push notifications for user:', userId);

      if (isSignedIn && userId) {
        try {
          // Get the current push token
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus === 'granted') {
            const token = await registerForPushNotificationsAsync(userId);
            currentToken = token;

            if (token) {
              console.log('Push notification registration successful for user:', userId);
            } else {
              console.error('Push notification registration failed - no token received');
            }
          } else {
            console.error('Notification permission not granted');
          }

          // Set up notification listeners
          cleanup = setupNotificationListeners();
        } catch (error) {
          console.error('Error in push notification setup:', error);
        }
      }
    };

    const cleanupPreviousUser = async () => {
      if (previousUserId.current && currentToken) {
        console.log('Cleaning up push token for previous user:', previousUserId.current);
        try {
          // Get the user document to check current tokens
          const userRef = doc(db, 'users', previousUserId.current);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentTokens = userData.pushTokens || [];

            // Only remove the token if it exists in the array
            if (currentTokens.includes(currentToken)) {
              await cleanupPushToken(previousUserId.current, currentToken);
              console.log('Successfully cleaned up token for previous user');
            }
          }
        } catch (error) {
          console.error('Error cleaning up previous user token:', error);
        }
      }
    };

    // If we have a previous user and a new user is signing in
    if (previousUserId.current && userId && previousUserId.current !== userId) {
      cleanupPreviousUser();
    }

    setupPushNotifications();

    // Update the previous user ID
    previousUserId.current = userId;

    // Clean up listeners when component unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isSignedIn, userId]);

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <Redirect href={"/(auth)/onboarding"} />;
}
