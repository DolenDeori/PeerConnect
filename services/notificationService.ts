import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
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

export const registerForPushNotificationsAsync = async (userId: string) => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get the token that uniquely identifies this device
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your Expo project ID
    })).data;

    // Save the token to Firestore
    if (token) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          pushToken: token,
        } as Partial<User>);
        console.log('Push token saved to Firestore');
      } catch (error) {
        console.error('Error saving push token:', error);
      }
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
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
