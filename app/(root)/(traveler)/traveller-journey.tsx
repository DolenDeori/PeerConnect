import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { doc, updateDoc, arrayUnion, getDoc} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { TravelModel } from "@/models/travelModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { GOOGLE_MAPS_API_KEY } from '@env';
import { PackageModel } from "@/models/packageModel";
import CustomButton from "@/components/customButton";
import { updateTravelStatus } from "@/services/travelService";
import { sendNotification } from "@/utils/sendNotification";
import { icons } from "@/constant";

const TravelerJourney = () => {
  const { travelId, destLat, destLng, packageId } = useLocalSearchParams();
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
  const [packageDetails, setPackageDetails] = useState<PackageModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [senderInfo, setSenderInfo] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [travelData, setTravelData] = useState<TravelModel | null>(null);

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

  const handleStartJourney = async () => {
    if (!travelId || !packageId || !packageDetails) return;

    try {
      // Update package status
      await updateDoc(doc(db, "packages", packageId as string), {
        status: "in_transit",
      });

      // Update travel status
      await updateTravelStatus(travelId as string, "in-progress");

      // Send notification to sender
      await sendNotification(
        packageDetails.senderId,
        "Package In Transit",
        `Your package (${packageDetails.trackingNumber}) is now in transit.`,
        {
          type: "package_update",
          packageId: packageId,
          status: "in_transit",
          trackingNumber: packageDetails.trackingNumber
        }
      );

      Alert.alert("Success", "Journey started successfully!");
    } catch (error) {
      console.error("Error starting journey:", error);
      Alert.alert("Error", "Failed to start journey. Please try again.");
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-4">
          <TouchableOpacity
            className="flex-row items-center mb-4 gap-1"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="black" />
            <Text>Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-HostGorteskBold mb-4">Your Journey Details</Text>
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
          <Text className="text-lg font-HostGorteskBold mb-4">Package Information</Text>

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="font-semibold mb-2">Package Details</Text>
            <Text>Type: {packageDetails?.packageInfo.type}</Text>
            <Text>Size: {packageDetails?.packageInfo.size}</Text>
            <Text>Weight: {packageDetails?.packageInfo.weight}</Text>
            <Text>Content: {packageDetails?.packageInfo.content}</Text>
            {packageDetails?.packageInfo.description && (
              <Text>Description: {packageDetails.packageInfo.description}</Text>
            )}
          </View>

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="font-semibold mb-2">Sender Information</Text>
            <Text>Name: {senderInfo?.fullName || senderInfo?.userName}</Text>
            <Text>Phone: {senderInfo?.phoneNumber}</Text>
            {senderInfo?.email && (
              <Text>Email: {senderInfo.email}</Text>
            )}
          </View>

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="font-semibold mb-2">Receiver Information</Text>
            <Text>Name: {packageDetails?.receiverInfo.name}</Text>
            <Text>Phone: {packageDetails?.receiverInfo.phoneNumber}</Text>
            {packageDetails?.receiverInfo.email && (
              <Text>Email: {packageDetails.receiverInfo.email}</Text>
            )}
          </View>

          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="font-semibold mb-2">Travel Details</Text>
            <Text>Pickup Location: {packageDetails?.packageInfo.pickupLocation.address}</Text>
            <Text>Delivery Location: {packageDetails?.packageInfo.deliveryLocation.address}</Text>
            <Text>Travel Medium: {travelData?.travelMedium}</Text>
            <Text>Price: ${travelData?.price}</Text>
          </View>

          <CustomButton
            title="Start Journey"
            onPress={handleStartJourney}
            bgVariant="success"
            className="mt-4"
          />
        </View>
      </ScrollView>
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
