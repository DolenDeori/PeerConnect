import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import { TravelModel } from "@/models/travelModel";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  MapPin,
  Circle as LucideCircle,
  User,
  UserCheck,
  IndianRupee,
} from "lucide-react-native";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { PackageModel } from "@/models/packageModel";
import CustomButton from "@/components/customButton";
import { updateTravelStatus, deleteTravel } from "@/services/travelService";
import { sendNotification } from "@/utils/sendNotification";
import { icons } from "@/constant";
import { updatePackageById, getPackageById } from "@/services/packageService";
import { getUserById, updateUserById } from "@/services/userService";
import { useUser } from "@clerk/clerk-expo";

const TravelerJourney = () => {
  const { travelId, destLat, destLng, packageId, price } =
    useLocalSearchParams();
  console.log("Travel ID:", travelId, "Package ID:", packageId);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [packageDeliveryLocation, setPackageDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [packagePickupLocation, setPackagePickupLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [packageDetails, setPackageDetails] = useState<PackageModel | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [senderInfo, setSenderInfo] = useState<any>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [locationWatcher, setLocationWatcher] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [travelData, setTravelData] = useState<TravelModel | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Location Error",
          "Permission to access location was denied."
        );
        return;
      }

      console.log("travell journey: ", travelData?.price);

      const travelRef = doc(db, "travels", travelId as string);
      const travelSnapshot = await getDoc(travelRef);
      if (travelSnapshot.exists()) {
        const data = travelSnapshot.data() as TravelModel;
        setTravelData(data);
        const coords = {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
        };
        const timestamp = new Date().toISOString();
        await updateDoc(travelRef, {
          currentLocation: coords,
          locationUpdates: arrayUnion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp,
          }),
        });
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(coords);

          const timestamp = new Date().toISOString();
          try {
            const travelRef = doc(db, "travels", travelId as string);
            const travelSnapshot = await getDoc(travelRef);
            if (travelSnapshot.exists()) {
              await updateDoc(travelRef, {
                currentLocation: coords,
                locationUpdates: arrayUnion({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  timestamp,
                }),
              });
            } else {
              console.warn("Travel document does not exist.");
            }
          } catch (err) {
            console.error("Failed to update Firestore:", err);
          }
        }
      );
    };

    const fetchPackageDetails = async () => {
      if (!packageId) return;
      try {
        const packageRef = doc(db, "packages", packageId as string);
        const packageSnapshot = await getDoc(packageRef);
        if (packageSnapshot.exists()) {
          const packageData = packageSnapshot.data() as PackageModel;
          setPackageDetails(packageData);

          // Fetch sender info right after we get package details
          if (packageData.senderId) {
            const senderRef = doc(db, "users", packageData.senderId);
            const senderSnap = await getDoc(senderRef);
            if (senderSnap.exists()) {
              setSenderInfo(senderSnap.data());
            }
          }

          const deliveryLoc = packageData.packageInfo.deliveryLocation;
          const pickupLoc = packageData.packageInfo.pickupLocation;

          setPackageDeliveryLocation({
            latitude: deliveryLoc.latitude,
            longitude: deliveryLoc.longitude,
          });

          setPackagePickupLocation({
            latitude: pickupLoc.latitude,
            longitude: pickupLoc.longitude,
          });
        } else {
          console.warn("Package document does not exist.");
        }
      } catch (error) {
        console.error("Failed to fetch package delivery location:", error);
      } finally {
        setLoading(false);
      }
    };

    startLocationUpdates();
    fetchPackageDetails();
  }, [packageId]);

  // Fetch route from current location to destination
  useEffect(() => {
    const fetchRoute = async () => {
      if (!location) return;

      try {
        if (!GOOGLE_MAPS_API_KEY) {
          console.error("Google Maps API key is not configured");
          return;
        }
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${packagePickupLocation?.latitude},${packagePickupLocation?.longitude}&destination=${packageDeliveryLocation?.latitude},${packageDeliveryLocation?.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await axios.get(url);

        if (response.data.routes.length) {
          const points = decodePolyline(
            response.data.routes[0].overview_polyline.points
          );
          setRouteCoords(points);
        } else {
          console.warn("No route found!");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [location]);

  // Real-time location updates only if in-progress
  useEffect(() => {
    let watcher: any = null;
    if (travelData?.travelStatus === "in-progress") {
      (async () => {
        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (loc) => {
            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(coords);
            const timestamp = new Date().toISOString();
            try {
              const travelRef = doc(db, "travels", travelId as string);
              const travelSnapshot = await getDoc(travelRef);
              if (travelSnapshot.exists()) {
                await updateDoc(travelRef, {
                  currentLocation: coords,
                  locationUpdates: arrayUnion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    timestamp,
                  }),
                });
              }
            } catch (err) {
              console.error("Failed to update Firestore:", err);
            }
          }
        );
        setLocationWatcher(watcher);
      })();
    } else if (locationWatcher) {
      // Stop location updates if not in-progress
      locationWatcher.remove();
      setLocationWatcher(null);
    }
    return () => {
      if (watcher) watcher.remove();
    };
  }, [travelData?.travelStatus]);

  // Start Journey
  const handleStartJourney = async () => {
    if (!travelId || !packageId) return;
    try {
      await updateTravelStatus(travelId as string, "in-progress");
      await updatePackageById(packageId as string, { status: "in-transit" });
      setJourneyStarted(true);
      setTravelData((prev) =>
        prev ? { ...prev, travelStatus: "in-progress" } : prev
      );
      setPackageDetails((prev) =>
        prev ? { ...prev, status: "in-transit" } : prev
      );
      Alert.alert("Journey Started", "Your journey is now in progress.");
    } catch (error) {
      Alert.alert("Error", "Failed to start journey. Please try again.");
    }
  };

  // Reject Journey
  const handleRejectPackage = async () => {
    if (!travelId || !packageId) return;
    try {
      await updateTravelStatus(travelId as string, "cancelled");
      await updatePackageById(packageId as string, { status: "pending" });
      setTravelData((prev) =>
        prev ? { ...prev, travelStatus: "cancelled" } : prev
      );
      setPackageDetails((prev) =>
        prev ? { ...prev, status: "pending" } : prev
      );
      Alert.alert("Rejected", "You have rejected this delivery.", [
        { text: "OK", onPress: () => router.replace("/traveler") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to reject package. Please try again.");
    }
  };

  // Complete Journey
  const handleCompleteJourney = async () => {
    if (!travelId || !packageId || !user?.id) return;
    try {
      await updateTravelStatus(travelId as string, "completed");
      await updatePackageById(packageId as string, { status: "delivered" });
      setTravelData((prev) =>
        prev ? { ...prev, travelStatus: "completed" } : prev
      );
      setPackageDetails((prev) =>
        prev ? { ...prev, status: "delivered" } : prev
      );
      // Add earnings to user
      const userData = await getUserById(user.id);
      const earning = travelData?.price || 0;
      setEarnings(earning);
      if (userData) {
        const newEarnings = (userData.earnings || 0) + earning;
        await updateUserById(user.id, { earnings: newEarnings });
      }
      setJourneyCompleted(true);
      if (locationWatcher) {
        locationWatcher.remove();
        setLocationWatcher(null);
      }
      Alert.alert(
        "Travel Completed",
        `You have successfully completed your travel.\nEarnings: ₹${earning}`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/traveler"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to complete journey. Please try again.");
    }
  };

  if (errorMsg) {
    return <Text style={styles.error}>{errorMsg}</Text>;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading journey details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 py-2">
        <TouchableOpacity
          className="flex-row items-center mb-4 gap-1"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-HostGorteskBold mb-4">
          Your Journey Details
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-4">
          {/* Show Price in large, green, noticeable font */}
          {price && (
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  color: "#10b981",
                  fontWeight: "bold",
                  fontSize: 36,
                  backgroundColor: "#e6f9f2",
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  borderRadius: 16,
                  overflow: "hidden",
                  marginTop: 8,
                }}
              >
                ₹{price}
              </Text>
              <Text
                style={{
                  color: "#10b981",
                  fontWeight: "600",
                  fontSize: 16,
                  marginTop: 4,
                }}
              >
                Your Earnings
              </Text>
            </View>
          )}
        </View>

        {/* Map View */}
        <View className="h-80 bg-black rounded-xl overflow-hidden mx-4">
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                ...location,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {/* Current location marker */}
              <Marker coordinate={location} title="You" />

              {/* Package Delivery Location marker + 300m circle */}
              {packageDeliveryLocation && (
                <>
                  <Marker
                    coordinate={packageDeliveryLocation}
                    title="Package Delivery Location"
                  >
                    <Image
                      source={icons.delivery_pin}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </Marker>
                  <Circle
                    center={packageDeliveryLocation}
                    radius={300}
                    strokeColor="rgba(255,165,0,0.8)"
                    fillColor="rgba(255,165,0,0.3)"
                  />
                </>
              )}

              {packagePickupLocation && (
                <>
                  <Marker
                    coordinate={packagePickupLocation}
                    title="Package Pickup Location"
                  >
                    <Image
                      source={icons.pickup_pin}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </Marker>
                  <Circle
                    center={packagePickupLocation}
                    radius={300}
                    strokeColor="rgba(128,0,128,0.8)"
                    fillColor="rgba(128,0,128,0.3)"
                  />
                </>
              )}

              {/* Draw route polyline */}
              {routeCoords.length > 0 && (
                <Polyline
                  coordinates={routeCoords}
                  strokeWidth={4}
                  strokeColor="#FF6347"
                />
              )}
            </MapView>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white">Loading map...</Text>
            </View>
          )}
        </View>

        {/* Package Details */}
        <View className="p-4">
          <Text className="text-lg font-HostGorteskBold mb-4">
            Package Information
          </Text>

          {/* Package Details Card */}
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
            <Text className="font-HostGorteskBold text-base mb-2 flex-row items-center">
              <UserCheck size={18} color="#2563eb" /> Package Details
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Type:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.packageInfo.type}
              </Text>
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Size:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.packageInfo.size}
              </Text>
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Weight:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.packageInfo.weight}
              </Text>
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Content:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.packageInfo.content}
              </Text>
            </Text>
            {packageDetails?.packageInfo.description && (
              <Text className="text-gray-700 font-DMSansMedium mb-1">
                Description:{" "}
                <Text className="font-DMSansRegular">
                  {packageDetails.packageInfo.description}
                </Text>
              </Text>
            )}
          </View>

          {/* Sender Info Card */}
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
            <Text className="font-HostGorteskBold text-base mb-2 flex-row items-center">
              <User size={18} color="#2563eb" /> Sender Information
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Name:{" "}
              <Text className="font-DMSansRegular">
                {senderInfo?.fullName || senderInfo?.userName}
              </Text>
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Phone:{" "}
              <Text className="font-DMSansRegular">
                {senderInfo?.phoneNumber}
              </Text>
            </Text>
            {senderInfo?.email && (
              <Text className="text-gray-700 font-DMSansMedium mb-1">
                Email:{" "}
                <Text className="font-DMSansRegular">{senderInfo.email}</Text>
              </Text>
            )}
          </View>

          {/* Receiver Info Card */}
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
            <Text className="font-HostGorteskBold text-base mb-2 flex-row items-center">
              <UserCheck size={18} color="#10b981" /> Receiver Information
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Name:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.receiverInfo.name}
              </Text>
            </Text>
            <Text className="text-gray-700 font-DMSansMedium mb-1">
              Phone:{" "}
              <Text className="font-DMSansRegular">
                {packageDetails?.receiverInfo.phoneNumber}
              </Text>
            </Text>
            {packageDetails?.receiverInfo.email && (
              <Text className="text-gray-700 font-DMSansMedium mb-1">
                Email:{" "}
                <Text className="font-DMSansRegular">
                  {packageDetails.receiverInfo.email}
                </Text>
              </Text>
            )}
          </View>

          {/* Travel Details Card */}
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
            <Text className="font-HostGorteskBold text-base mb-2 flex-row items-center">
              <MapPin size={18} color="#2563eb" /> Travel Details
            </Text>
            <View className="flex-row items-start mb-2">
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
                <LucideCircle size={16} color="#10b981" fill="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-DMSansMedium mb-1 text-gray-700">
                  Pickup:{" "}
                  <Text className="font-DMSansRegular">
                    {packageDetails?.packageInfo.pickupLocation.address}
                  </Text>
                </Text>
                <Text className="font-DMSansMedium text-gray-700">
                  Delivery:{" "}
                  <Text className="font-DMSansRegular">
                    {packageDetails?.packageInfo.deliveryLocation.address}
                  </Text>
                </Text>
              </View>
            </View>
            {/* Traveler Earnings Section */}
            <View style={{ alignItems: "flex-start", marginTop: 12 }}>
              <Text
                style={{
                  color: "#10b981",
                  fontWeight: "bold",
                  fontSize: 28,
                  backgroundColor: "#e6f9f2",
                  paddingHorizontal: 20,
                  paddingVertical: 6,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexDirection: "row",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <IndianRupee
                  size={24}
                  color="#10b981"
                  style={{ marginRight: 4 }}
                />
                {price || travelData?.price}
              </Text>
              <Text
                style={{
                  color: "#10b981",
                  fontWeight: "600",
                  fontSize: 15,
                  marginTop: 2,
                }}
              >
                You will earn for this travel
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="flex-row gap-2 w-full px-4 py-2">
        {/* Show Start/Reject only if not started */}
        {travelData?.travelStatus !== "in-progress" &&
          travelData?.travelStatus !== "completed" && (
            <>
              <CustomButton
                title="Start Journey"
                onPress={handleStartJourney}
                bgVariant="success"
                className="mt-2 flex-1"
              />
              <CustomButton
                title="Reject Package"
                onPress={handleRejectPackage}
                bgVariant="danger"
                className="mt-2 flex-1"
              />
            </>
          )}
        {/* Show Complete only if in-progress */}
        {travelData?.travelStatus === "in-progress" && (
          <CustomButton
            title="Complete Travel"
            onPress={handleCompleteJourney}
            bgVariant="success"
            className="mt-2 flex-1"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TravelerJourney;

// Helper function to decode polyline
function decodePolyline(t: string) {
  let points = [];
  let index = 0,
    len = t.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  error: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "red",
  },
});
