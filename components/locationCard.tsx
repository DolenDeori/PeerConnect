import { Text, View } from "react-native";

const LocationCard = ({ location }) => (
  <View className="border rounded p-3 mb-3 bg-gray-100">
    <Text className="font-semibold">{location.address}</Text>
    <Text>Street: {location.street}</Text>
    <Text>ZIP Code: {location.zipCode}</Text>
  </View>
);

export default LocationCard;
