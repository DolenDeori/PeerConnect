import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocateFixed } from "lucide-react-native";
import BottomSheet from "@gorhom/bottom-sheet";

const Step1 = () => {
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="mt-4">
        <Text className="text-3xl font-HostGorteskBold">Send Your Package</Text>
        <Text className="font-DMSansRegular">
          Provide your location information
        </Text>
      </View>
      <View className="mt-6">
        <TouchableOpacity className="p-4 flex flex-row items-center justify-center gap-2 bg-gray-200 rounded-xl mb-2">
          <LocateFixed color={"black"} size={20} />
          <Text>Add Pickup Location</Text>
        </TouchableOpacity>

        <TouchableOpacity className="p-4 flex flex-row items-center justify-center gap-2 bg-gray-200 rounded-xl mb-2">
          <LocateFixed color={"black"} size={20} />
          <Text>Add Pickup Location</Text>
        </TouchableOpacity>
      </View>
      <BottomSheet snapPoints={snapPoints}>
        <Text>Hello I am a Bottom Sheet</Text>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Step1;
