import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import CustomButton from "@/components/customButton";
import InputField from "@/components/inputField";
import { useForm } from "@/app/contex/FormContex";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GoogleTextInput from "@/components/googleTextInput";

const Step1 = () => {
  const { formData, updateFormData } = useForm();
  const [pickupPoint, setPickupPoint] = useState(
    formData.locationInfo.pickupPoint
  );
  const [deliveryPoint, setDeliveryPoint] = useState(
    formData.locationInfo.deliveryPoint
  );

  const handleNext = () => {
    updateFormData("locationInfo", { pickupPoint, deliveryPoint });
    router.push("/multistep/step2");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"black"} />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <View className="mt-4">
        <Text className="text-3xl font-HostGorteskBold">Send Package</Text>
        <Text className="font-DMSansRegular">
          Please provide your location information
        </Text>
      </View>
      <View className="mt-6">
        <GoogleTextInput placeholder="Select Pickup Location" />
        <GoogleTextInput placeholder="Select Delivery Location" />
      </View>
      <View className="py-2">
        <CustomButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default Step1;
