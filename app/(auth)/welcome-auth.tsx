import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { images } from "@/constant";
import { router } from "expo-router";

const WelcomeAuth = () => {
  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <View className="h-full w-full justify-center items-center bg-blue-500">
        <Image source={images.icon} className="h-14 w-14 mb-4" />
        <Text className="text-3xl font-HostGorteskBold text-white">
          Welcome
        </Text>
        <Text className="font-DMSansRegular text-white">
          Welcome to Peer Connect
        </Text>
        <View className="mt-5 gap-3 flex-row">
          <CustomButton
            title="Sign In"
            bgVariant="outline"
            onPress={() => router.push("/(auth)/sign-in")}
          />
          <CustomButton
            title="Create Account"
            bgVariant="outline"
            onPress={() => router.push("/(auth)/sign-up")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeAuth;
