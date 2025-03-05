import CustomButton from "@/components/customButton";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";

const mapAPI = process.env.GOOGLE_PLACES_API_KEY;

const Home = () => {
  const { user } = useUser();
  const loading = false;
  const [hasPermissions, setHasPermissions] = useState(false);

  const handleSendingClick = () => {
    router.push("/package-details");
  };

  return (
    <SafeAreaView className="flex flex-1 h-full w-full bg-gray-200 items-center justify-center">
      <Text className="font-HostGorteskBold text-3xl">
        Welcome{" "}
        {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
        To Peer Connect
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
