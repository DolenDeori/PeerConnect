import CustomButton from "@/components/customButton";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Menu, X } from "lucide-react-native";
import { useState } from "react";

const Home = () => {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) {
    return (
      <>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View className="bg-black opacity-35 h-full w-full z-1111"></View>
        </TouchableWithoutFeedback>
        <View className="h-full bg-white w-2/3 absolute">
          <View className="flex justify-end items-end p-2">
            <TouchableOpacity onPress={() => setShowMenu(false)}>
              <X color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-gray-100 p-4">
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Menu color={"black"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
