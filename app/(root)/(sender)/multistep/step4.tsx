import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useForm } from "@/app/contex/FormContex";
import { db } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const Step4 = () => {
  const { formData, resetFormData } = useForm();

  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user || !user.id) {
      alert("User not authenticated");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "packages"), {
        ...formData,
        userId: user.id,
        createdAt: new Date().toISOString(),
      });
      alert("Package submitted successfully. Document ID: " + docRef.id);
      resetFormData();
      router.replace("/home"); // Navigate to home or another screen after submission
    } catch (error: any) {
      alert("Error submitting package: " + error.message);
    }
  };
  return (
    <SafeAreaView className="flex-1 p-4">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"black"} />
          <Text className="font-DMSansMedium">Back</Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View>
          <Text className="text-3xl font-HostGorteskBold mt-5">Summary</Text>
        </View>
        <View className="mt-5">
          <View className="mb-4">
            <Text className="font-HostGorteskMedium">Location Information</Text>
            <Text>Pickup: {formData.locationInfo.pickupPoint}</Text>
            <Text>Delivery: {formData.locationInfo.deliveryPoint}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-xl font-semibold">Package Details</Text>
            <Text>Type: {formData.packageDetails.packageType}</Text>
            <Text>Size: {formData.packageDetails.packageSize}</Text>
            <Text>Weight: {formData.packageDetails.packageWeight}</Text>
            <Text>Content: {formData.packageDetails.packageContent}</Text>
            <Text>Waiting Period: {formData.packageDetails.waitingPeriod}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-xl font-semibold">Receiver Details</Text>
            <Text>Name: {formData.receiverDetails.receiverName}</Text>
            <Text>Phone: {formData.receiverDetails.receiverPhone}</Text>
          </View>
        </View>
      </ScrollView>
      <CustomButton title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default Step4;
