import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BellIcon,
  Menu,
  MenuSquare,
  MessageCircleQuestion,
} from "lucide-react-native";
import ImageCarousel from "@/components/ImageCarousel";
import CustomButton from "@/components/customButton";
import { homeMenuItems } from "@/constant";
import { router, Router } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-2">
      <View className="flex-row justify-between items-center py-4 px-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity activeOpacity={0.7}>
            <Menu color={"black"} />
          </TouchableOpacity>
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

          <View className="my-6">
            <Text className="text-lg font-HostGorteskMedium mb-4">Menu</Text>
            <View className="flex flex-row flex-wrap justify-between gap-y-4">
              {homeMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white rounded-xl w-[48%] p-4"
                  activeOpacity={0.7}
                  onPress={() => router.push(item.url as any)}
                >
                  <Image
                    source={item.icon}
                    className="w-10 h-10 mb-3"
                    resizeMode="contain"
                  />
                  <Text className="font-HostGorteskBold text-lg text-black">
                    {item.title}
                  </Text>
                  <Text className="text-sm font-DMSansRegular text-gray-500">
                    {item.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            <CustomButton
              title="Search Now"
              className="mt-4"
              bgVariant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
