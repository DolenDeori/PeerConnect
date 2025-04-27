import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const KYCPending = () => {
  const { status } = useLocalSearchParams<{ status?: string }>();

  let message = "Your KYC verification is still pending. You will be able to travel once your KYC is approved.";
  if (status === "rejected") {
    message = "Your KYC was rejected. Please contact support or resubmit your information.";
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
        <View className="my-4 px-2">
            <TouchableOpacity className="flex-row items-center gap-1" onPress={() => router.back()}>
                <ChevronLeft size={24} color="black" />
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center">
                  <View className="justify-center items-center p-8 rounded-lg">
        <Text className="text-4xl font-HostGorteskBold text-blue-700 mb-4">KYC {status === "rejected" ? "Rejected" : "Pending"}</Text>
        <Text className="text-lg text-gray-600 text-center font-DMSansMedium">{message}</Text>
      </View>
        </View>
    </SafeAreaView>
  );
};

export default KYCPending;
