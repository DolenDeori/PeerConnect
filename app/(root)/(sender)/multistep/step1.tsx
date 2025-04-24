import { View, Text } from "react-native";
import React, { useMemo } from "react";
import CustomBottomSheet from "@/components/customBottomSheet";
import { TextInput } from "react-native-gesture-handler";
import GoogleTextInput from "@/components/googleTextInput";
import { useFormStore } from "@/store";
import { LocationFromGoogle } from "@/types/type";

const Step1 = () => {
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  const updatePickupLocation = useFormStore(
    (state) => state.updatePickupLocation
  );
  const pickupLocation = useFormStore((state) => state.data.pickupLocation);
  return (
    <View className="flex-1 p-4 bg-white">
      <Text>Thi is sender page</Text>
      <GoogleTextInput
        placeholder="Choose pick up locations"
        handlePress={(location) => {
          updatePickupLocation(location);
        }}
      />
    </View>
  );
};

export default Step1;
