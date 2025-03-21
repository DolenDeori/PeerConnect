import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth, useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import { ArrowLeft, ChevronLeft, Settings, UserCog } from "lucide-react-native";

const profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { signOut } = useAuth();
  const onSginOutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in"); // Navigate to SignIn screen after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <TouchableWithoutFeedback
        onPress={() => router.push("/(root)/(tabs)/home")}
      >
        <View className="flex-row items-center gap-4">
          <ArrowLeft color={"black"} />
          <Text className="font-DMSansMedium">Profile</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Add additional fields as needed */}
      <View className="py-6 px-2">
        <View>
          <Text className="font-DMSansMedium">Hello,</Text>
          <Text className="font-HostGorteskBold text-xl">
            {userData.fullName}
          </Text>
        </View>
        <View className="gap-6 mt-6 border-b border-gray-200">
          <View>
            <Text className="font-HostGorteskMedium">My Earning</Text>
            {userData.earning ? (
              <View></View>
            ) : (
              <View className="bg-blue-50 h-20 justify-center items-center mt-2 rounded-xl">
                <Text className="text-gray-400">Travell to start earning</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-4 py-4 mb-4"
            onPress={() => router.push("/(root)/account-settings")}
          >
            <UserCog color={"black"} />
            <Text className="font-DMSansMedium">Account Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default profile;
