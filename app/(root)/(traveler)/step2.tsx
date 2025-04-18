// /app/traveller/step2.tsx
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import CustomButton from "@/components/customButton";

const TravellerStep2 = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-6">Select a Package</Text>
      {packages.length === 0 ? (
        <Text>No packages found for your route.</Text>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="p-4 border border-gray-200 rounded-lg mb-4">
              <Text className="text-lg font-bold">
                {item.packageDetails?.packageType || "Package"}
              </Text>
              <Text className="text-base">
                {item.locationInfo?.pickupPoint} →{" "}
                {item.locationInfo?.deliveryPoint}
              </Text>
              {/* Add more package details as needed */}
            </TouchableOpacity>
          )}
        />
      )}
      <CustomButton title="Back" onPress={() => router.back()} />
    </SafeAreaView>
  );
};

export default TravellerStep2;
