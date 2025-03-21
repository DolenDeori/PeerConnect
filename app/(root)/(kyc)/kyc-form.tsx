import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useUser } from "@clerk/clerk-expo";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";

const KYCForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [govId, setGovId] = useState<string>("");

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
      // Update the user's Firestore document in the "users" collection.
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        kyc: { govId: govId.trim(), isValid: true },
      });
      Alert.alert("Success", "KYC information updated successfully.");
      // Optionally, navigate the user to the next screen.
      router.replace("/(root)/(traveler)/step1");
    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-6">KYC Verification</Text>
      <Text className="text-lg mb-4">
        Please enter your Government ID to verify your identity:
      </Text>
      <TextInput
        className="bg-gray-100 rounded-lg p-4 mb-6 text-lg"
        placeholder="Enter Government ID"
        value={govId}
        onChangeText={setGovId}
      />
      <CustomButton title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default KYCForm;
