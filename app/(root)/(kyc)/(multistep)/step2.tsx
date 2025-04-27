import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useKYCFormStore } from "@/store/kycFormStore";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { kycService } from "@/services/kycService";
import { useUser } from "@clerk/clerk-expo";

const Step2 = () => {
  const { user } = useUser();
  const { formData, setFormData, nextStep, prevStep } = useKYCFormStore();
  const [frontImage, setFrontImage] = useState<string | null>(formData.documentImages?.front || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async (useCamera: boolean = false) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Required", "Camera permission is required to take photos.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
        });
        if (!result.canceled) {
          setFrontImage(result.assets[0].uri);
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
        });
        if (!result.canceled) {
          setFrontImage(result.assets[0].uri);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to access camera or gallery");
    }
  };

  const handleNext = async () => {
    if (!frontImage) {
      Alert.alert("Validation Error", "Please upload the front image of your document.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await kycService.uploadImage(user.id, frontImage, 'front');

      setFormData({
        documentImages: {
          ...formData.documentImages,
          front: imageUrl
        }
      });
      nextStep();
      router.replace("/step3");
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4 mt-8">
      <ScrollView>
        <Text className="text-4xl font-HostGorteskBold">Document Front</Text>

        <Text className="text-lg mb-4 font-DMSansMedium">
          Please upload a clear photo of the front of your document:
        </Text>

        {frontImage ? (
          <View className="mb-6">
            <Image
              source={{ uri: frontImage }}
              className="w-full h-64 rounded-lg mb-4"
              resizeMode="contain"
            />
            <View className="flex-row gap-2">
              <CustomButton
                title="Take Photo"
                onPress={() => pickImage(true)}
                bgVariant="primary"
              />
              <CustomButton
                title="Choose from Gallery"
                onPress={() => pickImage(false)}
                bgVariant="outline"
              />
            </View>
          </View>
        ) : (
          <View className="flex-row gap-2 mb-6">
            <CustomButton
              title="Take Photo"
              onPress={() => pickImage(true)}
            />
            <CustomButton
              title="Choose from Gallery"
              onPress={() => pickImage(false)}
            />
          </View>
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
            title={uploading ? "Uploading..." : "Next"}
            onPress={handleNext}
            disabled={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step2;
