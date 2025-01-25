import CustomButton from "@/components/customButton";
import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [count, setCount] = useState(1);
  const hanleClick = () => {
    if (count >= 40) return;
    setCount(count + 1);
  };
  return (
    <SafeAreaView className="flex flex-1 h-full w-full bg-gray-200 items-center justify-center">
      <Text className="font-HostGorteskBold text-3xl">This is Home Page</Text>
      <CustomButton
        title={`Click to Count ${count}`}
        className="mt-5"
        onPress={hanleClick}
        bgVariant="success"
      />
    </SafeAreaView>
  );
};

export default Home;
