import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { db } from '@/firebaseConfig';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useNavigation } from 'expo-router';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data?: any;
  createdAt: any;
  read: boolean;
}

const NotificationsScreen = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user?.id) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs: NotificationItem[] = [];
      querySnapshot.forEach((docSnap) => {
        notifs.push({ id: docSnap.id, ...docSnap.data() } as NotificationItem);
      });
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.id]);

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
      setNotifications((prev) => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notifId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notifId));
      setNotifications((prev) => prev.filter(n => n.id !== notifId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No notifications yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: item.read ? '#f0f0f0' : '#e0e7ff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => markAsRead(item.id)}
              activeOpacity={0.7}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
              <Text style={{ color: '#333', marginTop: 4 }}>{item.body}</Text>
              <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>
                {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
              <Text style={{ color: 'red', marginLeft: 16 }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsScreen;
