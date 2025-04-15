import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BellIcon, MessageCircleQuestion } from "lucide-react-native";
import ImageCarousel from "@/components/ImageCarousel";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-white px-2">
      <View className="flex-row justify-between items-center py-4 px-2">
        <View>
          <Text className="font-HostGorteskBold text-xl">
            <Text className="text-blue-600">PEER</Text>
            CONNECT
          </Text>
        </View>
        <View className="flex-row gap-6 items-center">
          <MessageCircleQuestion color={"black"} size={22} />
          <BellIcon color={"black"} size={22} />
        </View>
      </View>
      <ScrollView>
        <View className="px-2 py-4">
          <View>
            <ImageCarousel />
          </View>
          <View className="mt-6 p-4 bg-blue-700 rounded-xl">
            <Text className="font-HostGorteskBold text-2xl text-white">
              Track Your Package
            </Text>
            <Text className="font-DMSansRegular mt-2 text-white">
              Please enter your tracking number
            </Text>
            <TextInput
              className="bg-white rounded-lg mt-4 p-4 py-5"
              placeholder="Enter your tracking id"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
