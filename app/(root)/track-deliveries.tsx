import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // your Firestore config
import { PackageModel } from "@/models/packageModel"; // adjust the import path as needed
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TravelModel } from "@/models/travelModel";

type PackageWithTravelId = PackageModel & { travelId?: string | null };

const TrackDeliveris = () => {
  const { user } = useUser();
  const [inTransitPackages, setInTransitPackages] = useState<
    PackageWithTravelId[]
  >([]);
  const [deliveredPackages, setDeliveredPackages] = useState<
    PackageWithTravelId[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Step 1: Fetch packages
        const packageQuery = query(
          collection(db, "packages"),
          where("travelerId", "==", user?.id)
        );
        const packageSnapshot = await getDocs(packageQuery);
        const packages: PackageModel[] = [];

        packageSnapshot.forEach((doc) => {
          packages.push({ ...(doc.data() as PackageModel), id: doc.id });
        });

        // Step 2: Fetch travels
        const travelQuery = query(
          collection(db, "travels"),
          where("travelerId", "==", user?.id)
        );
        const travelSnapshot = await getDocs(travelQuery);
        const travels = travelSnapshot.docs.map((doc) => ({
          travelId: doc.id,
          ...doc.data(),
        })) as TravelModel[];

        // Step 3: Match travelId to each package
        const packagesWithTravelId = packages.map((pkg) => {
          const matchedTravel = travels.find(
            (travel) => travel.packageId === pkg.id
          );
          return {
            ...pkg,
            travelId: matchedTravel?.travelId ?? null,
          };
        });

        // Step 4: Filter and update state
        setInTransitPackages(
          packagesWithTravelId.filter((p) => p.status === "in_progress")
        );
        setDeliveredPackages(
          packagesWithTravelId.filter((p) => p.status === "delivered")
        );

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch packages or travels", error);
      }
    };

    if (user?.id) fetchPackages();
  }, [user]);

  const renderPackageItem = (item: PackageModel) => (
    <TouchableOpacity
      className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-200"
      onPress={() => {
        if (!item.travelId) return;
        router.push({
          pathname: "/traveller-journey",
          params: {
            travelId: item.travelId,
            destLat: item.packageInfo.deliveryLocation.latitude.toString(),
            destLng: item.packageInfo.deliveryLocation.longitude.toString(),
            packageId: item.id,
          },
        });
      }}
    >
      <Text className="font-semibold text-base">📦 {item.trackingNumber}</Text>
      <Text className="text-gray-600">
        From: {item.packageInfo.pickupLocation.city} → To:{" "}
        {item.packageInfo.deliveryLocation.city}
      </Text>
      <Text className="text-xs text-gray-500">Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-3">🟢 Ongoing Deliveries</Text>
      {inTransitPackages.length > 0 ? (
        <FlatList
          data={inTransitPackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderPackageItem(item)}
        />
      ) : (
        <Text className="text-gray-500 mb-6">No ongoing deliveries.</Text>
      )}

      <Text className="text-xl font-bold mt-6 mb-3">
        ✅ Completed Deliveries
      </Text>
      {deliveredPackages.length > 0 ? (
        <FlatList
          data={deliveredPackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderPackageItem(item)}
        />
      ) : (
        <Text className="text-gray-500">No completed deliveries yet.</Text>
      )}
    </SafeAreaView>
  );
};

export default TrackDeliveris;
