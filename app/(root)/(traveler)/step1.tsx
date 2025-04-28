import React, { useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import CustomButton from "@/components/customButton";
import GoogleTextInput from "@/components/googleTextInput";
import { useTravelerFormStore } from "@/store/travelerFormStore";
import { LocationFromGoogle } from "@/types/type";
import RNPickerSelect from "react-native-picker-select";
import * as Location from "expo-location";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const TravellerStep1 = () => {
  const router = useRouter();

  const updateStartLocation = useTravelerFormStore(
    (state) => state.updateStartLocation
  );
  const updateDestinationLocation = useTravelerFormStore(
    (state) => state.updateDestinationLocation
  );

  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<string>("");
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [startCoords, setStartCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destCoords, setDestCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleStartLocationChange = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updateStartLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: details?.formatted_address || "",
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
    });

    setStartCoords({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    // Update map region to show the new location
    setMapRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleDestinationLocationChange = (
    location: LocationFromGoogle,
    details: any
  ) => {
    const components = details?.address_components || [];
    const getComponent = (type: string) =>
      components.find((comp: any) => comp.types.includes(type))?.long_name;

    updateDestinationLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: details?.formatted_address || "",
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
    });

    setDestCoords({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    // If we have both locations, center the map between them
    if (startCoords) {
      const centerLat = (startCoords.latitude + location.latitude) / 2;
      const centerLng = (startCoords.longitude + location.longitude) / 2;
      const latDelta = Math.abs(startCoords.latitude - location.latitude) * 1.5;
      const lngDelta =
        Math.abs(startCoords.longitude - location.longitude) * 1.5;

      setMapRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
    }
  };

  const handleUseMyLocation = async () => {
    setLocLoading(true);
    setLocError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocError("Permission to access location was denied");
        setLocLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Compose address string
      const address = [
        place.name,
        place.street,
        place.city,
        place.region,
        place.postalCode,
        place.country,
      ]
        .filter(Boolean)
        .join(", ");

      // Update the location in the store
      handleStartLocationChange(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address,
        },
        {
          formatted_address: address,
          address_components: [
            { long_name: place.city, types: ["locality"] },
            { long_name: place.region, types: ["administrative_area_level_1"] },
          ],
        }
      );

      // Update the input field
      setStartLocation(address);
    } catch (e) {
      setLocError("Failed to get location");
    }
    setLocLoading(false);
  };

  const handleNext = () => {
    router.push("/step2");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1">
          <View className="p-4">
            <View className="mb-4">
              <TouchableOpacity
                className="flex-row gap-1"
                onPress={() => router.back()}
              >
                <ChevronLeft color={"black"} size={20} />
                <Text>Back</Text>
              </TouchableOpacity>
            </View>
            {/* Map View */}
            <View className="h-48 mb-6 rounded-xl overflow-hidden">
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                region={mapRegion}
                showsUserLocation={true}
              >
                {startCoords && (
                  <Marker
                    coordinate={startCoords}
                    title="Starting Point"
                    pinColor="blue"
                  />
                )}
                {destCoords && (
                  <Marker
                    coordinate={destCoords}
                    title="Destination"
                    pinColor="red"
                  />
                )}
                {startCoords && destCoords && (
                  <Polyline
                    coordinates={[startCoords, destCoords]}
                    strokeColor="#000"
                    strokeWidth={2}
                  />
                )}
              </MapView>
            </View>

            <View>
              <Text className="font-HostGorteskMedium mb-2">
                Enter your starting Point
              </Text>
              <View className="flex-row items-center gap-x-2">
                <View className="flex-1">
                  <GoogleTextInput
                    placeholder="Search your location.."
                    handlePress={handleStartLocationChange}
                    initialLocation={startLocation}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleUseMyLocation}
                  className="bg-blue-500 rounded-xl p-3 mb-5"
                  disabled={locLoading}
                >
                  <Text className="text-white font-bold">
                    {locLoading ? "..." : "Use My Location"}
                  </Text>
                </TouchableOpacity>
              </View>
              {locError && <Text className="text-red-500">{locError}</Text>}
            </View>
            <View>
              <Text className="font-HostGorteskMedium mb-2">
                Enter your destination Point
              </Text>
              <GoogleTextInput
                placeholder="Search your location.."
                handlePress={handleDestinationLocationChange}
              />
            </View>
          </View>
        </View>
        <View className="p-4 bg-white border-t border-gray-200">
          <CustomButton title="Next" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TravellerStep1;
