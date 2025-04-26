import "react-native-gesture-handler";
import "react-native-get-random-values";
import "react-native-reanimated";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { registerForPushNotificationsAsync, setupNotificationListeners } from '@/services/notificationService';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

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

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isSignedIn && userId) {
      // Register for push notifications when user is signed in
      registerForPushNotificationsAsync(userId);

      // Set up notification listeners
      cleanup = setupNotificationListeners();
    }

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
