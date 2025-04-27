import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useKYCFormStore } from "@/store/kycFormStore";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { kycService } from "@/services/kycService";
import { useUser } from "@clerk/clerk-expo";

const Step4 = () => {
  const { user } = useUser();
  const { formData, prevStep, resetForm } = useKYCFormStore();
  const [selfieImage, setSelfieImage] = useState<string | null>(formData.selfieImage || null);
  const [uploading, setUploading] = useState(false);

  const pickSelfie = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is required to take a selfie.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });
      if (!result.canceled) {
        setSelfieImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access camera");
    }
  };

  const handleSubmit = async () => {
    if (!selfieImage || !formData.govId || !formData.documentImages?.front || !formData.documentImages?.back) {
      Alert.alert("Validation Error", "Please complete all steps of the KYC process.");
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    try {
      setUploading(true);
      const selfieUrl = await kycService.uploadImage(user.id, selfieImage, "selfie");
      const finalKYCData = {
        govId: formData.govId,
        documentImages: formData.documentImages,
        selfieImage: selfieUrl,
        userId: user.id,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await kycService.submitKYC(user.id, finalKYCData);
      Alert.alert("Success", "Your KYC information has been submitted successfully. We will review it shortly.", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            router.replace("/(root)/(traveler)/kyc-pending");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Submission Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView>
        <Text className="text-3xl font-bold mb-6">Selfie Verification</Text>
        <Text className="text-lg mb-4">Please take a clear selfie for verification:</Text>
        {selfieImage ? (
          <View className="items-center mb-6">
            <Image
              source={{ uri: selfieImage }}
              className="w-64 h-64 rounded-full mb-4"
              resizeMode="cover"
            />
            <CustomButton title="Retake Selfie" onPress={pickSelfie} bgVariant="outline" />
          </View>
        ) : (
          <CustomButton title="Take Selfie" onPress={pickSelfie} className="mb-6" />
        )}
        <View className="flex-row justify-between">
          <CustomButton
            title="Back"
            onPress={() => {
              prevStep();
              router.back();
            }}
            bgVariant="outline"
          />
          <CustomButton
            title={uploading ? "Submitting..." : "Submit"}
            onPress={handleSubmit}
            disabled={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step4;
