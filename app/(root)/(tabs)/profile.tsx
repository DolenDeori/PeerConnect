import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import CustomInput from "@/components/customInput";
import { icons } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/customButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

const profile = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();

  const onSginOutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in"); // Navigate to SignIn screen after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="p-4">
        {/* Profile Image Container */}
        <View className="items-center mt-4">
          <Image source={icons.dp} className="h-36 w-36 rounded-full" />
          <TouchableOpacity className="h-9 w-9 rounded-full justify-center items-center -mt-6 ml-12 bg-orange-500">
            <Feather name="edit-3" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View className="items-center my-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.firstName ||
              user?.emailAddresses[0].emailAddress.split("@")[0]}
          </Text>
          <Text className="text-md text-gray-600 dark:text-gray-400"></Text>
        </View>

        {/* Input Fields */}
        <View className="my-4 space-y-4">
          <CustomInput
            label="Your Email"
            placeholder={`${
              user?.emailAddresses[0].emailAddress || "user@gmail.com"
            }`}
          />
          <CustomInput
            label="Phone Number"
            placeholder={`No Phone Number`}
            value=""
          />
          <CustomInput label="Password" placeholder="*******" />
        </View>

        {/* Logout Button */}
        <View className="mb-8">
          <CustomButton
            title="Log Out"
            bgVariant="danger"
            onPress={() => onSginOutPress()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
