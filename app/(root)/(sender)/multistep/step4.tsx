import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormStore } from "@/store";
import { useRouter } from "expo-router";
import { createPackage } from "@/services/packageService";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/clerk-expo";

const Step4 = () => {
  const { data } = useFormStore();
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !data.packageType ||
      !data.packageWeight ||
      !data.packageSize ||
      !data.packageContent ||
      !data.pickupLocation?.address ||
      !data.deliveryLocation?.address ||
      !data.receiverInfo?.name ||
      !data.receiverInfo?.phone
    ) {
      Alert.alert(
        "Missing Information",
        "Please complete all fields before submitting."
      );
      return;
    }

    const packageId = uuidv4();
    const trackingNumber =
      "TRK-" + Math.floor(100000 + Math.random() * 900000).toString();

    const packageModel = {
      id: packageId,
      senderId: user?.id || "unknown", // Replace with actual user ID
      trackingNumber,
      status: "pending",
      packageInfo: {
        type: data.packageType,
        weight: data.packageWeight,
        size: data.packageSize,
        content: data.packageContent,
        description: data.packageDescription || "",
        pickupLocation: data.pickupLocation?.address || "",
        dropoffLocation: data.deliveryLocation?.address || "",
      },
      receiverInfo: {
        name: data.receiverInfo?.name || "",
        phoneNumber: data.receiverInfo?.phone || "",
        email: data.receiverInfo?.email,
        alternativePhoneNumber: data.receiverInfo?.alternativePhone,
      },
    };

    try {
      await createPackage(packageModel);
      Alert.alert("Success", "Package created successfully!");
      router.push("/track-package"); // Navigate to a confirmation screen or reset
    } catch (error) {
      Alert.alert("Error", "Something went wrong while creating the package.");
      console.error(error);
    }
  };

  const DetailGroup = ({
    title,
    details,
    onEdit,
  }: {
    title: string;
    details: { label: string; value: string | undefined }[];
    onEdit: () => void;
  }) => (
    <View className="mb-6 p-4 rounded-xl bg-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-DMSansBold">{title}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text className="text-blue-600 font-DMSansSemiBold">Edit</Text>
        </TouchableOpacity>
      </View>
      {details.map((item, index) => (
        <Text key={index} className="text-base text-gray-800">
          {item.label}: {item.value || "—"}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-HostGorteskBold mb-2 mt-5">
          Review Summary
        </Text>
        <Text className="mb-4 text-gray-600">
          Review all your details before submission.
        </Text>

        <DetailGroup
          title="Package Details"
          onEdit={() => router.push("/step2")}
          details={[
            { label: "Type", value: data.packageType },
            { label: "Size", value: data.packageSize },
            { label: "Weight", value: data.packageWeight },
            { label: "Content", value: data.packageContent },
            { label: "Description", value: data.packageDescription },
          ]}
        />

        <DetailGroup
          title="Pickup & Dropoff"
          onEdit={() => router.push("/step1")}
          details={[
            { label: "Pickup", value: data.pickupLocation?.address },
            { label: "Dropoff", value: data.deliveryLocation?.address },
          ]}
        />

        <DetailGroup
          title="Receiver Info"
          onEdit={() => router.push("/step3")}
          details={[
            { label: "Name", value: data.receiverInfo?.name },
            { label: "Phone", value: data.receiverInfo?.phone },
            { label: "Email", value: data.receiverInfo?.email },
            { label: "Alt Phone", value: data.receiverInfo?.alternativePhone },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step4;
