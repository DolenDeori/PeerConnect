import CustomButton from "@/components/customButton";
import ImportantNotice from "@/components/importantNotice";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  ChevronLeftIcon,
  PencilIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const PackageSummaryScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white p-4">
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <ChevronLeftIcon size={24} color="black" />
          <Text className="text-lg font-DMSansSemiBold ml-2">Go back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl font-DMSansSemiBold mt-8">
          Your Package Summary
        </Text>
        <Text className="text-gray-500 font-DMSansRegular mb-4">
          Here is your final package summary, please go through it and update if
          any information is incorrect.
        </Text>

        {/* Address Details */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-DMSansSemiBold">ADDRESS DETAILS</Text>
            <TouchableOpacity>
              <PencilIcon size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View className="ml-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-700">Work (Pickup Point)</Text>
              <Text className="text-gray-500 ml-2">assam - 785006</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">
                {" "}
                <MapPinIcon className="h-3 w-3" color={"black"} /> Home
                (Delivery Point)
              </Text>
              <Text className="text-gray-500 ml-2">assam - 787001</Text>
            </View>
          </View>
        </View>

        {/* Package Details */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">PACKAGE DETAILS</Text>
            <TouchableOpacity>
              <PencilIcon size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View className="ml-4">
            <Text className="text-gray-700 mb-2">
              Package Content: Clothes & Personal Items
            </Text>
            <Text className="text-gray-700 mb-2">
              Package Description: Box / Carton
            </Text>
            <Text className="text-gray-700">Size: 500 gm - 2KG</Text>
          </View>
        </View>

        {/* Receiver Details */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">RECEIVER'S DETAILS</Text>
            <TouchableOpacity>
              <PencilIcon size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View className="ml-4">
            <Text className="text-gray-700 mb-2">
              Receiver's Name: Deepak Deori
            </Text>
            <Text className="text-gray-700">
              Receiver's Phone-number: +91 9876543627
            </Text>
          </View>
        </View>

        {/* Important Note */}
        <ImportantNotice message="An OTP will be shared to the receiver's phone number that has to be shared with the traveler during the delivery process. Ask your receivers to please be present at the delivery point for smooth delivery." />

        {/* Proceed to Pay Button */}
        <CustomButton className="mb-8" title="Proceed to pay" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PackageSummaryScreen;
