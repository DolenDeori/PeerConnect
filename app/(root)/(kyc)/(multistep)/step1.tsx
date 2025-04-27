import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { Picker } from "@react-native-picker/picker";
import { useKYCFormStore } from "@/store/kycFormStore";
import { router } from "expo-router";
import { KYCInfo } from "@/models/kycModel";
import InputField from "@/components/inputField";

const Step1 = () => {
  const { formData, setFormData, nextStep } = useKYCFormStore();
  const [idType, setIdType] = useState<KYCInfo['govId']['type']>(
    formData.govId?.type || 'aadhaar_card'
  );
  const [idNumber, setIdNumber] = useState(formData.govId?.number || "");

  const handleNext = () => {
    if (!idNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your ID number.");
      return;
    }

    setFormData({
      govId: {
        type: idType,
        number: idNumber.trim()
      }
    });
    nextStep();
    router.push("/step2");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView>
        <Text className="text-4xl font-HostGorteskBold mb-6 mt-8">ID Verification</Text>

        <Text className="text-lg mb-2 font-DMSansMedium">Select ID Type:</Text>
        <View className="bg-gray-100 rounded-xl mb-6 border border-gray-200 focus:border-purple-400">
          <Picker
            selectedValue={idType}
            onValueChange={(value) => setIdType(value as KYCInfo['govId']['type'])}
          >
            <Picker.Item label="Aadhaar Card" value="aadhaar_card" />
            <Picker.Item label="Passport" value="passport" />
            <Picker.Item label="Driving License" value="driving_license" />
          </Picker>
        </View>

        <Text className="text-lg mb-2 font-DMSansMedium">
          Please enter your ID number:
        </Text>

        <InputField placeholder={`Enter ${idType === 'aadhaar_card' ? 'Aadhaar' : idType} number`}
        value={idNumber}
        onChangeText={setIdNumber} keyboardType="numeric"/>

        <CustomButton title="Next" onPress={handleNext} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step1;
