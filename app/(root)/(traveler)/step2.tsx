import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTravelerFormStore } from "@/store/travelerFormStore";
import { getAllAvailablePackages } from "@/services/packageService";
import { PackageModel } from "@/models/packageModel";
import { useUser } from "@clerk/clerk-expo";
import { MapPin, Circle } from "lucide-react-native";
import {
  calculateDeliveryPrice,
  PackageSize,
  ContentType,
} from "@/utils/priceCalculator";
import { calculateDistanceKm } from "@/utils/distanceUtils";

const TravellerStep2 = () => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id || ""; // Get the current user's ID from Clerk
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculatedPrices, setCalculatedPrices] = useState<{
    [id: string]: number;
  }>({});

  const { data, selectPackage } = useTravelerFormStore();
  const { startLocation, destinationLocation, travelMedium } = data;

  const sizeLabelToValue: Record<string, PackageSize> = {
    "Small (up to 30x30x30 cm)": "small",
    "Medium (up to 50x50x50 cm)": "medium",
    "Large (up to 100x100x100 cm)": "large",
  };

  const contentTypeMap: Record<string, ContentType> = {
    clothes: "general",
    electronics: "fragile",
    documents: "general",
    books: "general",
    Clothes: "general", // handle capitalized
    Electronics: "fragile",
    Documents: "general",
    Books: "general",
    Food: "perishable",
  };

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

  useEffect(() => {
    const newPrices: { [id: string]: number } = {};
    packages.forEach((item) => {
      const pickup = item.packageInfo.pickupLocation;
      const delivery = item.packageInfo.deliveryLocation;
      const distanceKm = calculateDistanceKm(
        pickup.latitude,
        pickup.longitude,
        delivery.latitude,
        delivery.longitude
      );
      const weightCategoryMap: Record<string, number> = {
        "Light (1-5 kg)": 3,
        "Medium (5-10 kg)": 7.5,
        "Heavy (10-20 Kg)": 15,
      };
      const weightLabel: string = item.packageInfo.weight as string;
      const weightKg = weightCategoryMap[weightLabel] ?? 0;
      const sizeValue =
        sizeLabelToValue[item.packageInfo.size] || item.packageInfo.size;
      const contentValue =
        contentTypeMap[item.packageInfo.content] || "general";
      const price = calculateDeliveryPrice({
        distanceKm,
        packageSize: sizeValue,
        weightKg,
        contentType: contentValue,
      });
      newPrices[item.id] = price > 0 ? price : NaN;
    });
    setCalculatedPrices(newPrices);
  }, [packages]);

  const handleSelectPackage = (pkg: PackageModel) => {
    selectPackage(pkg.id, pkg.price);
    router.push("/step3");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-HostGorteskBold mb-4">
        Available Packages
      </Text>

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
              <Text className="text-xl font-HostGorteskMedium">
                {item.packageInfo.type}
              </Text>
              {/* Pickup & Delivery with icons and dotted line */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginVertical: 8,
                }}
              >
                {/* Icons and dotted line */}
                <View style={{ alignItems: "center", marginRight: 8 }}>
                  <MapPin size={20} color="#2563eb" />
                  <View
                    style={{
                      width: 2,
                      height: 20,
                      borderStyle: "dotted",
                      borderLeftWidth: 2,
                      borderColor: "#2563eb",
                      marginVertical: 2,
                    }}
                  />
                  <Circle size={16} color="#10b981" fill="#10b981" />
                </View>
                {/* Addresses */}
                <View style={{ flex: 1 }}>
                  <Text style={{ marginBottom: 8 }}>
                    From: {item.packageInfo.pickupLocation.address}
                  </Text>
                  <Text>To: {item.packageInfo.deliveryLocation.address}</Text>
                </View>
              </View>
              <Text>
                Price: ₹
                {!isNaN(calculatedPrices[item.id])
                  ? calculatedPrices[item.id]
                  : "N/A"}
              </Text>
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
