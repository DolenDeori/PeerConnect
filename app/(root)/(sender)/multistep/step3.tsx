import React, { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/inputField";
import { useFormStore } from "@/store";
import { useRouter } from "expo-router";
import CustomButton from "@/components/customButton";

const Step3 = () => {
  const router = useRouter();
  const { data, updateReceiverInfo } = useFormStore();

  const [receiver, setReceiver] = useState({
    name: data.receiverInfo?.name || "",
    phone: data.receiverInfo?.phone || "",
    email: data.receiverInfo?.email || "",
    alternativePhone: data.receiverInfo?.alternativePhone || "",
  });

  const handleChange = (field: keyof typeof receiver, value: string) => {
    setReceiver((prev) => ({ ...prev, [field]: value }));
    updateReceiverInfo({ [field]: value });
  };

  const handleNext = useCallback(() => {
    router.push("/multistep/step4");
  }, []);

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-HostGorteskBold mt-5">
          Receiver Details
        </Text>
        <Text className="text-base font-DMSansRegular text-gray-600 mb-4">
          Enter your receiver's details
        </Text>

        <View className="mt-4">
          <InputField
            label="Full Name"
            placeholder="Enter Receiver's Name"
            value={receiver.name}
            onChangeText={(value) => handleChange("name", value)}
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
          <InputField
            label="Phone Number"
            placeholder="Enter Receiver's Phone"
            keyboardType="phone-pad"
            value={receiver.phone}
            onChangeText={(value) => handleChange("phone", value)}
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
          <InputField
            label="Email"
            placeholder="Enter Receiver's Email"
            keyboardType="email-address"
            value={receiver.email}
            onChangeText={(value) => handleChange("email", value)}
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
          <InputField
            label="Alternate Phone"
            placeholder="Enter Alternate Phone (optional)"
            keyboardType="phone-pad"
            value={receiver.alternativePhone}
            onChangeText={(value) => handleChange("alternativePhone", value)}
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
        </View>
      </ScrollView>
      <View>
        <CustomButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default Step3;
