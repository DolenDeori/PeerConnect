import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";

const Map = () => {
  const initialLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  const [myLocation, setMyLocation] = useState(initialLocation);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={style.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={style.map}
        initialRegion={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.158,
          longitudeDelta: 0.12,
        }}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userInterfaceStyle="light"
        showsMyLocationButton={true}
        mapType="standard"
      >
        {myLocation.latitude && myLocation.longitude && (
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            title="my current location"
            description="I am here"
          />
        )}
      </MapView>
    </View>
  );
};

export default Map;

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    overflow: "hidden",
    borderRadius: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
});
