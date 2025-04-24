import { View } from "react-native";
import React, { useRef, useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GoogleInputProps, LocationFromGoogle } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  initialLocation,
  containerStyle,
  placeholder = "Search for a location...",
  textInputBackgroundColor = "white",
  handlePress,
}: GoogleInputProps) => {
  const ref = useRef<any>(null);

  // Set initial value if available
  useEffect(() => {
    if (initialLocation && ref.current) {
      ref.current.setAddressText(initialLocation);
    }
  }, [initialLocation]);

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl border mb-4 ${containerStyle}`}
    >
      <GooglePlacesAutocomplete
        ref={ref}
        fetchDetails
        debounce={200}
        placeholder={placeholder}
        onPress={(data, details = null) => {
          const location: LocationFromGoogle = {
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          };
          handlePress(location);
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            borderRadius: 20,
            paddingHorizontal: 10,
          },
          textInput: {
            backgroundColor: textInputBackgroundColor,
            fontSize: 16,
            fontWeight: "600",
            borderRadius: 10,
            paddingHorizontal: 10,
          },
          listView: {
            backgroundColor: textInputBackgroundColor,
            borderRadius: 10,
            zIndex: 100,
          },
        }}
        textInputProps={{
          placeholderTextColor: "gray",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
