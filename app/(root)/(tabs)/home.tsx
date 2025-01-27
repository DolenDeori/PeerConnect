import CustomButton from "@/components/customButton";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [count, setCount] = useState(1);
  const hanleClick = () => {
    if (count >= 40) return;
    setCount(count + 1);
  };
  return (
    <SafeAreaView className="flex flex-1 h-full w-full bg-gray-200 items-center justify-center">
      <Text className="font-HostGorteskBold text-3xl">
        Welcome To Peer Connect
      </Text>
      <View className="flex flex-row gap-4 mx-8">
        <CustomButton
          title={`I am Travlling`}
          className="mt-5 flex-1"
          onPress={hanleClick}
        />
        <CustomButton
          title={`I am Sending`}
          className="mt-5 flex-1"
          onPress={hanleClick}
          bgVariant="success"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
