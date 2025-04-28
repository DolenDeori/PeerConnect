import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTravelerFormStore } from "@/store/travelerFormStore";
import { getPackageById, updatePackageById } from "@/services/packageService";
import { PackageModel } from "@/models/packageModel";
import CustomButton from "@/components/customButton";
import { ChevronLeftIcon } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import {
  calculateDeliveryPrice,
  ContentType,
  PackageSize,
} from "@/utils/priceCalculator"; // adjust path if needed
import { calculateDistanceKm } from "@/utils/distanceUtils";
import { createTravel } from "@/services/travelService";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import * as Notifications from "expo-notifications";
import { MapPin, Circle } from "lucide-react-native";
import * as Location from "expo-location";

const TravellerStep3 = () => {
  const { user } = useUser();
  const userId = user?.id; // Get the user ID from the Clerk user object
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState<PackageModel | null>(
    null
  );
  const [confirming, setConfirming] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distanceToPickup, setDistanceToPickup] = useState<number | null>(null);
  const [senderInfo, setSenderInfo] = useState<{
    fullName?: string;
    userName?: string;
    phoneNumber?: string;
    email?: string;
  } | null>(null);

  // Get the selected package data from the store
  const { data } = useTravelerFormStore();
  const { selectedPackageId, price } = data;

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!selectedPackageId) {
        return;
      }

      try {
        setLoading(true);
        const pkg = await getPackageById(selectedPackageId);
        if (pkg) {
          setPackageDetails(pkg);
        }
      } catch (error) {
        console.error("Failed to fetch package details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [selectedPackageId]);

  useEffect(() => {
    if (packageDetails) {
      const {
        packageInfo: {
          pickupLocation,
          deliveryLocation,
          size,
          weight,
          content,
        },
      } = packageDetails;

      const distanceKm = calculateDistanceKm(
        pickupLocation.latitude,
        pickupLocation.longitude,
        deliveryLocation.latitude,
        deliveryLocation.longitude
      );

      console.log(
        "pickup lat/lng",
        pickupLocation.latitude,
        pickupLocation.longitude
      );
      console.log(
        "delivery lat/lng",
        deliveryLocation.latitude,
        deliveryLocation.longitude
      );
      console.log("size:", size);
      console.log("weight (raw):", weight);
      console.log("content:", content);
      console.log("distanceKm:", distanceKm);

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
        Clothes: "general",
        Electronics: "fragile",
        Documents: "general",
        Books: "general",
        Food: "perishable",
      };
      const weightCategoryMap: Record<string, number> = {
        "Light (1-5 kg)": 3,
        "Medium (5-10 kg)": 7.5,
        "Heavy (10-20 Kg)": 15,
      };
      const weightLabel = packageDetails.packageInfo.weight;
      const weightKg = weightCategoryMap[weightLabel] ?? 0;
      const sizeValue = sizeLabelToValue[size] || size;
      const contentValue = contentTypeMap[content] || "general";
      const price = calculateDeliveryPrice({
        distanceKm,
        packageSize: sizeValue as PackageSize,
        weightKg,
        contentType: contentValue as ContentType,
      });
      if (distanceKm <= 0) {
        console.warn(
          "Distance is zero or less. Check pickup and delivery coordinates."
        );
      }
      const finalPrice = price > 0 ? price : 50; // fallback to ₹50
      setCalculatedPrice(finalPrice);
    }
  }, [packageDetails]);

  useEffect(() => {
    // Get current location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (packageDetails && currentLocation) {
      const pickup = packageDetails.packageInfo.pickupLocation;
      const dist = calculateDistanceKm(
        currentLocation.latitude,
        currentLocation.longitude,
        pickup.latitude,
        pickup.longitude
      );
      setDistanceToPickup(dist);
    }
  }, [packageDetails, currentLocation]);

  useEffect(() => {
    console.log(calculatedPrice);
    if (packageDetails?.senderId) {
      const fetchSenderInfo = async () => {
        const senderRef = firestoreDoc(db, "users", packageDetails.senderId);
        const senderSnap = await getDoc(senderRef);
        if (senderSnap.exists()) setSenderInfo(senderSnap.data() as any);
      };
      fetchSenderInfo();
    }
  }, [packageDetails]);

  const handleConfirmPackage = async () => {
    if (!packageDetails || !userId) return;

    try {
      setConfirming(true);

      // 1. Update the package to assign the traveler
      if (selectedPackageId) {
        await updatePackageById(selectedPackageId, {
          travelerId: userId,
          price: calculatedPrice,
          status: "in_progress",
        });
      } else {
        console.error("Selected package ID is null.");
      }

      // 2. Create the new travel document
      const travelId = await createTravel({
        travelerId: userId,
        packageId: selectedPackageId ?? "",
        startLocation: {
          ...packageDetails.packageInfo.pickupLocation,
          city:
            packageDetails.packageInfo.pickupLocation.city || "Unknown City",
          state:
            packageDetails.packageInfo.pickupLocation.state || "Unknown State",
        },
        destinationLocation: {
          ...packageDetails.packageInfo.deliveryLocation,
          city:
            packageDetails.packageInfo.deliveryLocation.city || "Unknown City",
          state:
            packageDetails.packageInfo.deliveryLocation.state ||
            "Unknown State",
        },
        trackingNumber: packageDetails.trackingNumber,
        price: calculatedPrice,
        notes: "",
        travelStatus: "pending",
      });

      // 3. Add a notification to Firestore for the sender
      await addDoc(collection(db, "notifications"), {
        userId: packageDetails.senderId, // The sender's user ID
        title: "Package Accepted by Traveler",
        body: `Your package (${packageDetails.trackingNumber}) has been accepted and is now in progress.`,
        data: { packageId: selectedPackageId, status: "in progress" },
        createdAt: serverTimestamp(),
        read: false,
      });

      // 4. Send a push notification to the sender (if they have a pushToken)
      // Fetch the sender's user document
      const senderRef = firestoreDoc(db, "users", packageDetails.senderId);
      const senderSnap = await getDoc(senderRef);

      if (senderSnap.exists()) {
        const senderData = senderSnap.data();
        const pushTokens = senderData.pushTokens || [];

        if (pushTokens.length > 0) {
          try {
            console.log(
              "Sending notification to sender with tokens:",
              pushTokens
            );

            // Add notification to Firestore for persistence
            await addDoc(collection(db, "notifications"), {
              userId: packageDetails.senderId,
              title: "Package Accepted by Traveler",
              body: `Your package (${packageDetails.trackingNumber}) has been accepted and is now in progress.`,
              data: {
                packageId: selectedPackageId,
                status: "in_progress",
                trackingNumber: packageDetails.trackingNumber,
                travelerId: user?.id,
                createdAt: serverTimestamp(),
              },
              createdAt: serverTimestamp(),
              read: false,
            });

            // Send push notification to all of sender's devices
            const message = {
              to: pushTokens,
              sound: "default",
              title: "Package Accepted by Traveler",
              body: `Your package (${packageDetails.trackingNumber}) has been accepted and is now in progress.`,
              data: {
                packageId: selectedPackageId,
                status: "in_progress",
                trackingNumber: packageDetails.trackingNumber,
                travelerId: user?.id,
              },
            };

            const response = await fetch(
              "https://exp.host/--/api/v2/push/send",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              }
            );

            const result = await response.json();
            console.log("Push notification sent successfully:", result);
          } catch (error) {
            console.error("Error sending notification:", error);
            // Continue with the flow even if notification fails
          }
        } else {
          console.log("Sender has no push tokens registered");
        }
      } else {
        console.error("Sender document not found");
      }

      // 5. Navigate to the next screen with travelId
      router.push({
        pathname: "/traveller-journey",
        params: {
          travelId,
          destLat:
            packageDetails.packageInfo.deliveryLocation.latitude.toString(),
          destLng:
            packageDetails.packageInfo.deliveryLocation.longitude.toString(),
          packageId: selectedPackageId,
          price: calculatedPrice.toString(),
        },
      });
    } catch (error) {
      console.error("Error confirming package:", error);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!packageDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text>No package details found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4 gap-1"
        >
          <ChevronLeftIcon size={24} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-4xl font-HostGorteskBold mb-4">Travel Summary</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Package Details */}
          <Text className="text-lg font-HostGorteskBold mb-2">
            Package Details
          </Text>
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text>Type: {packageDetails.packageInfo.type}</Text>
            <Text>Size: {packageDetails.packageInfo.size}</Text>
            <Text>Weight: {packageDetails.packageInfo.weight}</Text>
            <Text>Content: {packageDetails.packageInfo.content}</Text>
            {packageDetails.packageInfo.description && (
              <Text>Description: {packageDetails.packageInfo.description}</Text>
            )}
          </View>
          {/* Sender Info */}
          <Text className="text-lg font-HostGorteskBold mb-2">
            Sender Information
          </Text>
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text>
              Name: {senderInfo?.fullName || senderInfo?.userName || "N/A"}
            </Text>
            <Text>Phone: {senderInfo?.phoneNumber || "N/A"}</Text>
            <Text>Email: {senderInfo?.email || "N/A"}</Text>
          </View>
          {/* Pickup & Delivery */}
          <Text className="text-lg font-HostGorteskBold mb-2">
            Pickup & Delivery
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginVertical: 8,
            }}
          >
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
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 8 }}>
                Pickup: {packageDetails.packageInfo.pickupLocation.address}
              </Text>
              <Text>
                Delivery: {packageDetails.packageInfo.deliveryLocation.address}
              </Text>
            </View>
          </View>
          {/* Distances */}
          <Text className="text-lg font-HostGorteskBold mb-2">Distances</Text>
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text>
              Pickup to Delivery:{" "}
              {(() => {
                const pickup = packageDetails.packageInfo.pickupLocation;
                const delivery = packageDetails.packageInfo.deliveryLocation;
                const dist = calculateDistanceKm(
                  pickup.latitude,
                  pickup.longitude,
                  delivery.latitude,
                  delivery.longitude
                );
                return dist.toFixed(2) + " km";
              })()}
            </Text>
            <Text>
              Your Location to Pickup:{" "}
              {distanceToPickup !== null
                ? distanceToPickup.toFixed(2) + " km"
                : "..."}
            </Text>
          </View>
          {/* Price */}
          <Text className="text-lg font-HostGorteskBold mb-2">Earnings</Text>
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text
              style={{ color: "#10b981", fontWeight: "bold", fontSize: 20 }}
            >
              ₹{calculatedPrice} (You will earn)
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="mt-4">
        <CustomButton
          title={confirming ? "Confirming..." : "Confirm Package"}
          onPress={handleConfirmPackage}
          disabled={confirming}
        />
      </View>
    </SafeAreaView>
  );
};

export default TravellerStep3;
