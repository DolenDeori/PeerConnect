import React from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/inputField";

const Step3 = () => {
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-HostGorteskBold mt-5">
          Receiver Details
        </Text>
        <Text>Enter your receivers details</Text>
        <View className="mt-4">
          <InputField
            label="Full Name"
            placeholder="Enter Receiver's Name"
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
          <InputField
            label="Phone Number"
            placeholder="Enter Receiver's Phone"
            keyboardType="phone-pad"
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step3;
