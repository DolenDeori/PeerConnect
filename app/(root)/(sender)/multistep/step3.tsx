import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useForm } from "@/app/contex/FormContex";
import { useRouter } from "expo-router";
import InputField from "@/components/inputField";
import { ChevronLeft } from "lucide-react-native";

const Step3 = () => {
  const router = useRouter();
  const { formData, updateFormData } = useForm();

  const [receiverName, setReceiverName] = useState(
    formData.receiverDetails.receiverName
  );
  const [receiverPhone, setReceiverPhone] = useState(
    formData.receiverDetails.receiverPhone
  );

  const handleNext = () => {
    updateFormData("receiverDetails", { receiverName, receiverPhone });
    router.push("/multistep/step4");
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"black"} />
          <Text className="font-DMSansMedium">Back</Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <Text className="text-3xl font-HostGorteskBold mt-5">
          Receiver Details
        </Text>
        <Text>Enter your receivers details</Text>
        <View className="mt-4">
          <InputField
            label="Full Name"
            placeholder="Enter Receiver's Name"
            value={receiverName}
            onChangeText={setReceiverName}
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
          <InputField
            label="Phone Number"
            placeholder="Enter Receiver's Phone"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            keyboardType="phone-pad"
            className="bg-gray-100 rounded-lg p-4 mb-4"
          />
        </View>
      </ScrollView>
      <View className="py-2">
        <CustomButton title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default Step3;
