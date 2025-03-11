import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@clerk/clerk-expo";

const profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        Alert.alert("Error", "User is not authenticated");
        setLoading(false);
        return;
      }
      try {
        // Get the document reference using the Clerk user ID
        const userDocRef = doc(db, "users", user.id);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          Alert.alert(
            "No Data",
            "User profile does not exist in the database."
          );
        }
      } catch (error: any) {
        Alert.alert("Error Fetching Profile", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>No user data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-3xl font-bold mb-6 text-center">User Profile</Text>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Full Name:</Text>
        <Text className="text-lg text-gray-600">{userData.fullName}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Username:</Text>
        <Text className="text-lg text-gray-600">{userData.userName}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">First Name:</Text>
        <Text className="text-lg text-gray-600">{userData.firstName}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Last Name:</Text>
        <Text className="text-lg text-gray-600">{userData.lastName}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Phone Number:</Text>
        <Text className="text-lg text-gray-600">{userData.phoneNumber}</Text>
      </View>

      {/* Add additional fields as needed */}
    </SafeAreaView>
  );
};

export default profile;
