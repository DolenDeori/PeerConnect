import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth, useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import {
  ArrowLeft,
  UserCog,
  BadgeCheck,
  XCircle,
  IndianRupee,
  MapPin,
  CheckCircle2,
} from "lucide-react-native";
import { images } from "@/constant";
import { getUserById } from "@/services/userService";
import { User as UserType } from "@/models/userModel";
import { collection, query, where, getDocs } from "firebase/firestore";
import { kycService } from "@/services/kycService";

const profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<
    (UserType & { kycStatus?: string }) | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { signOut } = useAuth();
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [completedTravels, setCompletedTravels] = useState<number>(0);

  // for logout
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
        const data = await getUserById(user?.id);
        if (data) {
          setUserData(data);
        } else {
          Alert.alert(
            "No Data",
            "User profile does not exist in the database."
          );
        }

        // Fetch KYC status from the KYC collection
        const kycDoc = await kycService.getKYCStatus(user.id);
        setKycStatus((kycDoc?.status ?? "pending").toLowerCase());

        // Fetch completed travels count
        const travelsQuery = query(
          collection(db, "travels"),
          where("travelerId", "==", user.id),
          where("travelStatus", "==", "completed")
        );
        const travelsSnap = await getDocs(travelsQuery);
        setCompletedTravels(travelsSnap.size);
      } catch (error: any) {
        Alert.alert("Error Fetching Profile", error.message);
      } finally {
        setLoading(false);
      }
    };
    console.log("kycStatus: ", kycStatus);

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

      <View className="py-6 px-2">
        <View className="flex-row gap-6 items-center">
          <View>
            <Image source={images.avatar_2} className="h-16 w-16" />
          </View>
          <View>
            <Text className="font-DMSansMedium">Hello,</Text>
            <Text className="font-HostGorteskBold text-xl">
              {userData?.firstName} {userData?.lastName}
            </Text>
            {/* KYC Status Badge */}
            <View className="flex-row items-center mt-2">
              {kycStatus === "approved" && (
                <View className="flex-row items-center bg-green-50 rounded-full gap-1 px-3 py-1">
                  <BadgeCheck size={16} color="#10b981" className="mr-1" />
                  <Text className="text-green-600 font-bold">KYC Approved</Text>
                </View>
              )}
              {kycStatus === "pending" && (
                <View className="flex-row items-center bg-yellow-100 rounded-full gap-1 px-3 py-1">
                  <MapPin size={16} color="#fbbf24" className="mr-1" />
                  <Text className="text-yellow-600 font-bold">KYC Pending</Text>
                </View>
              )}
              {kycStatus === "rejected" && (
                <View className="flex-row items-center bg-red-100 rounded-full px-3 gap-1 py-1">
                  <XCircle size={16} color="#ef4444" className="mr-1" />
                  <Text className="text-red-600 font-bold">KYC Rejected</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="gap-6 mt-6 border-b border-gray-200">
          <View>
            <Text className="font-HostGorteskMedium">My Earnings</Text>
            <View className="bg-blue-50 h-20 justify-center items-center mt-2 mb-2 rounded-xl flex-row gap-2">
              {userData?.earnings && userData.earnings > 0 ? (
                <Text className="text-2xl font-bold text-blue-700">
                  ₹{userData.earnings}
                </Text>
              ) : (
                <Text className="text-gray-400">Travel to start earning</Text>
              )}
            </View>
            {/* Completed Travels */}
            <View className="flex-row items-center mt-3">
              <CheckCircle2
                size={18}
                color="#10b981"
                style={{ marginRight: 6 }}
              />
              <Text className="font-HostGorteskMedium text-base text-gray-700">
                Completed Travels:{" "}
                <Text className="font-bold text-green-600">
                  {completedTravels}
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-4 py-4 mb-4"
            onPress={() => router.push("/(root)/account-settings")}
          >
            <UserCog color={"black"} />
            <Text className="font-DMSansMedium">Account Settings</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-6">
          <CustomButton
            title="log out"
            bgVariant="danger"
            onPress={onSginOutPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default profile;
