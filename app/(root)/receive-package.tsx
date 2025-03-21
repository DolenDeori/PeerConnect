import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

const ReceivePackage = () => {
  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"black"} />
          <Text className="font-DMSansMedium">Back</Text>
        </View>
      </TouchableOpacity>
      <View className=" h-full w-full justify-center items-center">
        <Text>No Packages to Recive</Text>
      </View>
    </SafeAreaView>
  );
};

export default ReceivePackage;
