// /app/traveller/step1.tsx
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import InputField from "@/components/inputField";

const TravellerStep1 = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-6">Travel Information</Text>
    </SafeAreaView>
  );
};

export default TravellerStep1;
