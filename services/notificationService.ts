import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { User } from '@/models/userModel';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Store the last token to detect changes
let lastToken: string | null = null;

export const registerForPushNotificationsAsync = async (userId: string) => {
  console.log('Starting push notification registration for user:', userId);
  let token;

  if (Platform.OS === 'android') {
    console.log('Setting up Android notification channel');
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    console.log('Device detected, requesting permissions');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('Requesting notification permissions');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification! Status:', finalStatus);
      return;
    }

    console.log('Permissions granted, getting push token');
    try {
      // Get the token that uniquely identifies this device
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'e62d5b22-8a56-4926-8168-c294a693641e', // Your Expo project ID
      })).data;

      console.log('Generated push token:', token);

      // Only update if the token has changed
      if (token && token !== lastToken) {
        console.log('Token is new or changed, updating Firestore');
        try {
          const userRef = doc(db, 'users', userId);

          // First, get the current user document
          const userDoc = await getDoc(userRef);
          console.log('User document exists:', userDoc.exists());

          if (!userDoc.exists()) {
            console.error('User document not found, creating new document');
            // Create new document with pushTokens array
            await setDoc(userRef, {
              pushTokens: [token]
            });
            console.log('Created new user document with push token');
          } else {
            const userData = userDoc.data();
            const currentTokens = userData.pushTokens || [];
            console.log('Current tokens:', currentTokens);

            // Check if token already exists
            if (!currentTokens.includes(token)) {
              console.log('Adding new push token to user document');
              await updateDoc(userRef, {
                pushTokens: arrayUnion(token)
              });
              console.log('Push token saved to Firestore');
            } else {
              console.log('Token already exists in user document');
            }
          }

          lastToken = token;
        } catch (error) {
          console.error('Error saving push token to Firestore:', error);
        }
      } else {
        console.log('Token unchanged, skipping update');
      }
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

export const cleanupPushToken = async (userId: string, token: string) => {
  console.log('Cleaning up push token for user:', userId);
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pushTokens: arrayRemove(token)
    });
    console.log('Push token removed from Firestore');
  } catch (error) {
    console.error('Error removing push token:', error);
  }
};

export const handleNotificationResponse = (notification: Notifications.Notification) => {
  // Handle the notification when it's received
  console.log('Notification received:', notification);

  // You can add custom logic here based on the notification data
  const { data } = notification.request.content;

  if (data.type === 'travel_update') {
    // Handle travel-related notifications
    console.log('Travel update received:', data);
  } else if (data.type === 'package_update') {
    // Handle package-related notifications
    console.log('Package update received:', data);
  }
};

// Listen for incoming notifications
export const setupNotificationListeners = () => {
  // This listener is fired whenever a notification is received while the app is foregrounded
  const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationResponse);

  // This listener is fired whenever a user taps on or interacts with a notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response:', response);
  });

  return () => {
    // Clean up the listeners
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};
