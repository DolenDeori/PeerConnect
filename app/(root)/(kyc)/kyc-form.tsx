import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useUser } from "@clerk/clerk-expo";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { KYCInfo } from "@/models/kycModel";
import { Picker } from "@react-native-picker/picker";

const KYCForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [govId, setGovId] = useState<string>("");
  const [idType, setIdType] = useState<KYCInfo['govId']['type']>('aadhaar_card');

  const handleSubmit = async () => {
    if (!govId.trim()) {
      Alert.alert("Validation Error", "Please enter your Government ID.");
      return;
    }
    if (!user || !user.id) {
      Alert.alert("User Error", "User is not authenticated.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        kyc: {
          govId: {
            number: govId.trim(),
            type: idType
          },
          isValid: true
        },
      });
      Alert.alert("Success", "KYC information updated successfully.");
      router.replace("/(root)/(traveler)/step1");
    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView>
        <Text className="text-3xl font-bold mb-6">KYC Verification</Text>

        <Text className="text-lg mb-2">Select ID Type:</Text>
        <View className="bg-gray-100 rounded-lg mb-6">
          <Picker
            selectedValue={idType}
            onValueChange={(value) => setIdType(value as KYCInfo['govId']['type'])}
          >
            <Picker.Item label="Aadhaar Card" value="aadhaar_card" />
            <Picker.Item label="Passport" value="passport" />
            <Picker.Item label="Driving License" value="driving_license" />
          </Picker>
        </View>

        <Text className="text-lg mb-2">
          Please enter your Government ID number:
        </Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-6 text-lg"
          placeholder={`Enter ${idType === 'aadhaar_card' ? 'Aadhaar' : idType} number`}
          value={govId}
          onChangeText={setGovId}
          keyboardType="numeric"
        />

        <CustomButton title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default KYCForm;
