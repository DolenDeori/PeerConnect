import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTravelerFormStore } from "@/store/travelerFormStore";
import { getAllAvailablePackages } from "@/services/packageService";
import { PackageModel } from "@/models/packageModel";
import { useUser } from "@clerk/clerk-expo";

const TravellerStep2 = () => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id || ""; // Get the current user's ID from Clerk
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [loading, setLoading] = useState(true);

  const { data, selectPackage } = useTravelerFormStore();
  const { startLocation, destinationLocation } = data;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const allPackages = await getAllAvailablePackages();

        const filtered = allPackages.filter((pkg) => {
          const pickup = pkg.packageInfo.pickupLocation;
          const delivery = pkg.packageInfo.deliveryLocation;

          // ✅ Filter 1: Not posted by current user
          const isNotMyPackage = pkg.senderId !== userId;

          // ✅ Filter 2: Pickup location must match exact city
          const isSameCity = pickup.city === startLocation.city;
          const isSameDestination = delivery.city === destinationLocation.city;

          return isNotMyPackage && isSameCity && isSameDestination;
        });

        setPackages(filtered);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [startLocation, userId]);

  const handleSelectPackage = (pkg: PackageModel) => {
    selectPackage(pkg.id, pkg.price);
    router.push("/step3");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl font-semibold mb-4">Available Packages</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : packages.length === 0 ? (
        <Text className="text-gray-500">No packages found for your route.</Text>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPackage(item)}
              className="border p-4 rounded-xl mb-3 shadow-sm bg-gray-50"
            >
              <Text className="text-base font-semibold">
                📦 {item.packageInfo.type} - {item.trackingNumber}
              </Text>
              <Text>
                From: {item.packageInfo.pickupLocation.city},{" "}
                {item.packageInfo.pickupLocation.state}
              </Text>
              <Text>
                To: {item.packageInfo.deliveryLocation.city},{" "}
                {item.packageInfo.deliveryLocation.state}
              </Text>
              <Text>Price: ₹{item.price}</Text>
              <Text className="text-sm text-gray-500">
                Tap to deliver this package
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default TravellerStep2;
