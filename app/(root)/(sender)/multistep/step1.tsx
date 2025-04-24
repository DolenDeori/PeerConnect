import { View, Text } from "react-native";
import React, { useCallback, useEffect } from "react";
import GoogleTextInput from "@/components/googleTextInput";
import { useFormStore } from "@/store";
import { LocationFromGoogle } from "@/types/type";
import { router } from "expo-router";
import { useNavigationStore } from "@/store";

const Step1 = () => {
  const { setHandleNext } = useNavigationStore();
  const updatePickupLocation = useFormStore(
    (state) => state.updatePickupLocation
  );
  const pickupLocation = useFormStore((state) => state.data.pickupLocation);

  const handleNext = useCallback(() => {
    console.log("Step 1 → updating form data");
    updatePickupLocation(pickupLocation as LocationFromGoogle);
    router.push("/step2");
  }, []);

  useEffect(() => {
    setHandleNext(() => handleNext); // set the handleNext function in the store

    return () => {
      setHandleNext(null); // clean up the handleNext function when the component unmounts
    };
  }, [handleNext]);

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
