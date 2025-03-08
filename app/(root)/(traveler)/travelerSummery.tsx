import { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  ChevronLeftIcon,
  InformationCircleIcon,
  PhoneIcon,
} from "react-native-heroicons/outline";
import CustomButton from "@/components/customButton";
import ImportantNotice from "@/components/importantNotice";
import { SafeAreaView } from "react-native-safe-area-context";

const travelerSummery = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white p-4">
        {/* Back Button */}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={20} color="black" />
          <Text className="ml-2 text-black font-medium">Go back</Text>
        </TouchableOpacity>

        {/* Travel Path */}
        <View className="flex-row justify-between items-center border-b pb-2 border-gray-300">
          <Text className="text-gray-700">
            Jorhat{"\n"}
            <Text className="text-gray-500 text-xs">Assam</Text>
          </Text>
          <Text className="text-gray-700">
            North Lakhimpur{"\n"}
            <Text className="text-gray-500 text-xs">Assam</Text>
          </Text>
        </View>

        {/* Sender Details */}
        <Text className="text-lg font-bold mt-4">Sender Details</Text>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-700">Sender’s Name</Text>
          <Text className="text-gray-900 font-medium">Dolen Chandra Deori</Text>
        </View>
        <CustomButton title="Call Sender" />

        {/* Package Details */}
        <Text className="text-lg font-bold mt-6">Package Details</Text>
        <View className="mt-2">
          <Text className="text-gray-500 font-medium">ADDRESS DETAILS</Text>
          <View className="mt-1">
            <Text className="text-black">
              ○ Work <Text className="text-gray-500">(Pickup Point)</Text>
            </Text>
            <Text className="text-gray-600 text-xs">Assam - 785006</Text>
          </View>
          <View className="mt-2">
            <Text className="text-black">
              📍 Home <Text className="text-gray-500">(Delivery Point)</Text>
            </Text>
            <Text className="text-gray-600 text-xs">Assam - 787001</Text>
          </View>
        </View>

        {/* Package Content */}
        <View className="mt-4">
          <Text className="text-gray-500 font-medium">PACKAGE DETAILS</Text>
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-700">Package Content</Text>
            <Text className="text-gray-900">Clothes & Personal Items</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Package Description</Text>
            <Text className="text-gray-900">Box / Carton</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Size</Text>
            <Text className="text-gray-900">500 gm - 2KG</Text>
          </View>
        </View>

        {/* Receiver’s Details */}
        <View className="mt-4">
          <Text className="text-gray-500 font-medium">RECEIVER’S DETAILS</Text>
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-700">Receiver’s Name</Text>
            <Text className="text-gray-900">Deepak Deori</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Receiver’s Phone</Text>
            <Text className="text-gray-900">+91 9876543627</Text>
          </View>
        </View>

        {/* Important Info Box */}
        <View>
          <ImportantNotice
            message="An OTP will be shared to the receiver’s phone number that has to be
          shared with the traveler during the delivery process."
          />
        </View>

        {/* Confirmation Button */}
        <View className="mb-8">
          <CustomButton title="Packge Delivered" bgVariant="success" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default travelerSummery;
