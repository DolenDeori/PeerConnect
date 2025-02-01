import CustomButton from "@/components/customButton";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const mapAPI = process.env.GOOGLE_PLACES_API_KEY;
const Home = () => {
  const handleSendingClick = () => {
    router.push("/package-details"); // Navigate to the PackageDetailsScreen
  };

  return (
    <SafeAreaView className="flex flex-1 h-full w-full bg-gray-200 items-center justify-center">
      <GooglePlacesAutocomplete
        fetchDetails={true}
        debounce={200}
        placeholder="search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: `${mapAPI}`,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: "black",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
      />
      <Text className="font-HostGorteskBold text-3xl">
        Welcome To Peer Connect
      </Text>
      <View className="flex flex-row gap-4 mx-8">
        <CustomButton
          title={`I am Traveling`}
          className="mt-5 flex-1"
          onPress={() => {}}
        />
        <CustomButton
          title={`I am Sending`}
          className="mt-5 flex-1"
          onPress={handleSendingClick}
          bgVariant="success"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
