import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const sendNotification = async (
  userId: string,
  title: string,
  body: string,
  data: any = {}
) => {
  try {
    // Get the user's push token from Firestore
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error('User not found');
      return;
    }

    const userData = userDoc.data();
    const pushToken = userData.pushToken;

    if (!pushToken) {
      console.error('No push token found for user');
      return;
    }

    // Send the notification using Expo's push notification service
    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
