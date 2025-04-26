import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import CustomButton from "@/components/customButton";
import GoogleTextInput from "@/components/googleTextInput";
import { useTravelerFormStore } from "@/store/travelerFormStore";
import { LocationFromGoogle } from "@/types/type";
import RNPickerSelect from "react-native-picker-select";

const TravellerStep1 = () => {
  const router = useRouter();

  const updateStartLocation = useTravelerFormStore(
    (state) => state.updateStartLocation
  );
  const updateDestinationLocation = useTravelerFormStore(
    (state) => state.updateDestinationLocation
  );

  const setTravelMedium = useTravelerFormStore(
    (state) => state.setTravelMedium
  );

  const handleStartLocationChange = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updateStartLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: details?.formatted_address || "",
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
    });
  };

  const handleDestinationLocationChange = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updateDestinationLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: details?.formatted_address || "",
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
    });
  };

  const handleNext = () => {
    router.push("/step2");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-1">
        <View className="mb-4">
          <TouchableOpacity
            className="flex-row gap-1"
            onPress={() => router.back()}
          >
            <ChevronLeft color={"black"} size={20} />
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-4xl font-HostGorteskBold mb-6">
          Lets Do something Good.
        </Text>
        <View>
          <Text className="font-HostGorteskMedium mb-2">
            Enter your starting Point
          </Text>
          <GoogleTextInput
            placeholder="Search your location.."
            handlePress={handleStartLocationChange}
          />
        </View>
        <View>
          <Text className="font-HostGorteskMedium mb-2">
            Enter your destination Point
          </Text>
          <GoogleTextInput
            placeholder="Search your location.."
            handlePress={handleDestinationLocationChange}
          />
        </View>
        <View>
          <Text className="font-HostGorteskMedium mb-2">
            Select your travel medium
          </Text>
          <View className="bg-gray-100 rounded-xl">
            <RNPickerSelect
              onValueChange={(value) => {
                setTravelMedium(value);
              }}
              items={[
                { label: "Car", value: "Car" },
                { label: "Bike", value: "Bike" },
                { label: "Truck", value: "Truck" },
              ]}
              placeholder={{
                label: "Choose travel medium",
                value: null,
              }}
              style={{
                inputAndroid: {
                  height: 50,
                  borderColor: "gray",
                  borderWidth: 1,
                  paddingLeft: 10,
                  borderRadius: 5,
                  marginBottom: 20,
                },
              }}
            />
          </View>
        </View>
      </View>
      <View>
        <CustomButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default TravellerStep1;
