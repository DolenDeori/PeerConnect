import { CustomButton } from "@/components/customButton";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  const onButtonPress = () => {};
  return (
    <SafeAreaView>
      <Text className="bg-black mt-10">Welcome User</Text>
    </SafeAreaView>
  );
};

export default Welcome;
