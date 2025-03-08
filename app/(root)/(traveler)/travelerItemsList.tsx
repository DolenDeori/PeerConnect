import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";

const travelerItemsList = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const packages = [
    { id: 1, from: "Jorhat", to: "North Lakhimpur", posted: "Today 12:30 AM" },
    { id: 2, from: "Jorhat", to: "North Lakhimpur", posted: "Today 12:30 AM" },
    { id: 3, from: "Jorhat", to: "North Lakhimpur", posted: "Today 12:30 AM" },
    { id: 4, from: "Jorhat", to: "North Lakhimpur", posted: "Today 12:30 AM" },
  ];

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        className="flex-1 bg-white dark:bg-gray-900"
        data={packages}
        ListHeaderComponent={
          <View className="p-4">
            {/* Header */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center mb-5"
            >
              <ChevronLeftIcon size={24} color="black" />
              <Text className="text-lg font-semibold ml-2 text-black dark:text-white">
                Go back
              </Text>
            </TouchableOpacity>

            {/* Route Summary */}
            <Text className="text-xl font-bold">Your travelling path</Text>
            <View className="mt-2">
              <View className="flex-row items-center">
                <MapPinIcon size={20} color="black" />
                <Text className="ml-2 font-semibold">
                  Jorhat (Pickup Point)
                </Text>
              </View>
              <Text className="ml-6 text-gray-500">Assam - 785006</Text>

              <View className="flex-row items-center mt-2">
                <MapPinIcon size={20} color="black" />
                <Text className="ml-2 font-semibold">
                  North Lakhimpur (Delivery Point)
                </Text>
              </View>
              <Text className="ml-6 text-gray-500">Assam - 787001</Text>
            </View>

            {/* Section Title */}
            <Text className="mt-6 text-lg font-bold">
              Select Package To Deliver
            </Text>
            <Text className="text-gray-500 mb-4">
              Select a package that you can take from your current location and
              help to deliver at destination.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-gray-200 p-4 mx-4 mb-2 rounded-xl">
            <Text className="text-lg font-semibold">
              {item.from} → {item.to}
            </Text>
            <Text className="text-gray-600">Posted: {item.posted}</Text>
            <TouchableOpacity className="mt-4 bg-black p-2 rounded-full">
              <Text className="text-white text-center">Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View className="p-4">
        <CustomButton
          title="Next"
          onPress={() => router.push("/(root)/travelerSummery")}
        />
      </View>
    </SafeAreaView>
  );
};

export default travelerItemsList;
