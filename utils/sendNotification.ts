import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const sendNotification = async (
  userId: string,
  title: string,
  body: string,
  data: any = {}
) => {
  try {
    // Get the user's push tokens from Firestore
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error('User not found');
      return;
    }

    const userData = userDoc.data();
    const pushTokens = userData.pushTokens || [];

    if (pushTokens.length === 0) {
      console.error('No push tokens found for user');
      return;
    }

    // Send the notification to all registered devices
    const message = {
      to: pushTokens,
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

    console.log('Notification sent successfully to all devices');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
