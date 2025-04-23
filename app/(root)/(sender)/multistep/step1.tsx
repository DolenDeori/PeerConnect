import { View, Text } from "react-native";
import React, { useMemo } from "react";
import CustomBottomSheet from "@/components/customBottomSheet";

const Step1 = () => {
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  return (
    <View className="flex-1">
      <CustomBottomSheet snapPoints={["25%", "40%"]}>
        <Text>This is a custom bottom sheet</Text>
      </CustomBottomSheet>
    </View>
  );
};

export default Step1;
