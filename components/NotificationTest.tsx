import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { sendNotification } from '@/utils/sendNotification';

export const NotificationTest = () => {
  const { userId } = useAuth();

  const handleSendTestNotification = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      await sendNotification(
        userId,
        'Test Notification',
        'This is a test notification from your app',
        {
          type: 'test',
          timestamp: new Date().toISOString()
        }
      );
      Alert.alert('Success', 'Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Test Push Notifications
      </Text>
      <TouchableOpacity
        onPress={handleSendTestNotification}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Send Test Notification
        </Text>
      </TouchableOpacity>
    </View>
  );
};
