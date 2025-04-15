import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getUserById } from "@/services/userService";

const AccountSettings = () => {
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
        const data = await getUserById(user?.id);
        if (data) {
          setUserData(data);
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
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View>
        <Text className="font-HostGorteskMedium text-xl">
          Your account information
        </Text>
      </View>
      <View className="mt-6 gap-4">
        <View>
          <Text className="font-DMSansSemiBold">Username</Text>
          <TextInput
            placeholder={userData?.userName}
            className="bg-gray-50 font-DMSansRegular px-2 py-4 mt-2 rounded-xl"
            editable={false}
          />
        </View>
        <View>
          <Text className="font-DMSansSemiBold">Email</Text>
          <TextInput
            placeholder={userData?.email}
            className="bg-gray-50 font-DMSansRegular px-2 py-4 mt-2 rounded-xl"
            editable={false}
          />
        </View>
        <View>
          <Text className="font-DMSansSemiBold">Phone Number</Text>
          <TextInput
            placeholder={`+91-${userData?.phoneNumber}`}
            className="bg-gray-50 font-DMSansRegular px-2 py-4 mt-2 rounded-xl"
            editable={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettings;
