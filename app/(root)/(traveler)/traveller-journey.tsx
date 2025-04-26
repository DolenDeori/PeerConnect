import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // adjust path if needed
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios"; // we'll use axios to call Directions API
import BottomSheet from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useRef } from "react";
import { TravelModel } from "@/models/travelModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { GOOGLE_MAPS_API_KEY } from '@env';

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
        const timestamp = new Date().toISOString(); // Declare and initialize timestamp
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
          const packageData = packageSnapshot.data();
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
      }
    };

    startLocationUpdates();
    fetchPackageDetails();
  }, []);

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

  if (errorMsg) {
    return <Text style={styles.error}>{errorMsg}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View>
        <TouchableOpacity className="flex-row items-center mb-4 gap-1">
          <ChevronLeft
            size={24}
            color="black"
            onPress={() => router.push("/")}
          />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity className="flex-row items-center mb-4 gap-1">
          <Text className="text-xl font-HostGorteskBold">
            Your Travel Details
          </Text>
        </TouchableOpacity>
      </View>
      <View className=" bg-black rounded-xl overflow-hidden">
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

            {/* Destination marker */}
            <Marker
              coordinate={{
                latitude: Number(destLat),
                longitude: Number(destLng),
              }}
              title="Destination"
              pinColor="green"
            />

            {/* Package Delivery Location marker + 300m circle */}
            {packageDeliveryLocation && (
              <>
                <Marker
                  coordinate={packageDeliveryLocation}
                  title="Package Delivery Location"
                  pinColor="orange"
                />
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
                  pinColor="purple"
                />
                <Circle
                  center={packagePickupLocation}
                  radius={300}
                  strokeColor="rgba(128,0,128,0.8)" // purple
                  fillColor="rgba(128,0,128,0.3)"
                />
              </>
            )}

            {/* Draw route polyline */}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeWidth={4}
                strokeColor="#FF6347" // To mato color for the polyline
              />
            )}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your journey map...</Text>
          </View>
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
    height: 400,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  error: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "red",
  },
  container: {
    flex: 1,
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  sheetContent: {
    padding: 20,
    backgroundColor: "#fff",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

function setTravelData(data: TravelModel) {
  throw new Error("Function not implemented.");
}
