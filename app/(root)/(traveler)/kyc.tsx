import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

const Kyc = () => {
  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"white"} />
          <Text className="font-DMSansMedium text-white">Back</Text>
        </View>
      </TouchableOpacity>
      <View className="h-full w-full justify-center items-center">
        <Text className="text-3xl font-HostGorteskBold text-white">
          KYC not done
        </Text>
        <Text className="font-DMSansRegular text-white">
          To Proceed Please provide your KY Infor
        </Text>
        <View className="mt-8">
          <CustomButton
            title="Start my KYC"
            bgVariant="outline"
            onPress={() => router.push("/(root)/(kyc)/kyc-form")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Kyc;
