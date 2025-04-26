// Step1.tsx
import CustomButton from "@/components/customButton";
import GoogleTextInput from "@/components/googleTextInput";
import { LocationFromGoogle } from "@/types/type";
import { router } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormStore } from "@/store";

const Step1 = () => {
  const handleNext = () => {
    router.push("/multistep/step2");
  };
  const updatePickupLocation = useFormStore(
    (state) => state.updatePickupLocation
  );
  const updateDeliveryLocation = useFormStore(
    (state) => state.updateDeliveryLocation
  );

  const handlePickupLocationSelect = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updatePickupLocation({
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
    });
  };

  const handleDeliveryLocationSelect = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updateDeliveryLocation({
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-4">
        <Text className="text-4xl font-HostGorteskBold">
          Provide Location Information
        </Text>

        {/* Pickup Location Section */}
        <View className="mt-6 gap-y-4">
          <GoogleTextInput
            placeholder="Search Your Pickup Location.."
            handlePress={handlePickupLocationSelect}
          />
          <GoogleTextInput
            placeholder="Search You Delivery Location.."
            handlePress={handleDeliveryLocationSelect}
          />
        </View>
      </View>

      <View className="p-4 bg-white">
        <CustomButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default Step1;
