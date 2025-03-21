// /app/traveller/step1.tsx
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import { useTravellerForm } from "@/app/contex/TravelerFormContex";
import InputField from "@/components/inputField";

const TravellerStep1 = () => {
  const router = useRouter();
  const { formData, updateFormData } = useTravellerForm();
  const [startLocation, setStartLocation] = useState(
    formData.travelInfo.startLocation
  );
  const [destinationLocation, setDestinationLocation] = useState(
    formData.travelInfo.destinationLocation
  );

  const handleNext = () => {
    updateFormData("travelInfo", { startLocation, destinationLocation });
    router.push("/(root)/(traveler)/step2");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-6">Travel Information</Text>
      <InputField
        placeholder="Enter Starting Location"
        value={startLocation}
        onChangeText={setStartLocation}
        className="bg-gray-100 rounded-lg p-4 mb-4"
      />
      <InputField
        placeholder="Enter Destination Location"
        value={destinationLocation}
        onChangeText={setDestinationLocation}
        className="bg-gray-100 rounded-lg p-4 mb-4"
      />
      <CustomButton title="Next" onPress={handleNext} />
    </SafeAreaView>
  );
};

export default TravellerStep1;
