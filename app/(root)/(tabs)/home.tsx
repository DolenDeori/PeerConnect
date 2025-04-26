import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BellIcon, Menu, MessageCircleQuestion, X } from "lucide-react-native";
import ImageCarousel from "@/components/ImageCarousel";
import CustomButton from "@/components/customButton";
import { homeMenuItems, homeSidebarMenuLinks } from "@/constant";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";

const screenWidth = Dimensions.get("window").width;

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarX = useSharedValue(-screenWidth);

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    sidebarX.value = withTiming(open ? 0 : -screenWidth, { duration: 400 });
  };

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarX.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Sidebar & Overlay */}
      {isSidebarOpen && (
        <Pressable
          onPress={() => toggleSidebar(false)}
          className="absolute top-0 left-0 w-full h-full bg-black/50 z-20"
        />
      )}
      <Animated.View
        style={[{ width: screenWidth * 0.7 }, sidebarStyle]}
        className="h-full bg-white absolute top-0 left-0 z-30 p-4"
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-HostGorteskBold">Options</Text>
          <TouchableOpacity onPress={() => toggleSidebar(false)}>
            <X size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Sidebar links */}
        {homeSidebarMenuLinks.map((group, groupIndex) => (
          <View key={group.id}>
            {/* Separator */}
            {groupIndex < homeSidebarMenuLinks.length && (
              <View className="h-[1px] bg-gray-300 my-3" />
            )}
            {group.items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.link as any)}
                className="py-3 px-2 flex-row items-center gap-3"
                activeOpacity={0.7}
              >
                {item.icon && <item.icon color={"black"} size={20} />}
                <Text className="text-base text-black font-HostGorteskMedium">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </Animated.View>

      {/* Top Bar */}
      <View className="flex-row justify-between items-center py-4 px-4">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => toggleSidebar(true)}
            activeOpacity={0.7}
          >
            <Menu color={"black"} />
          </TouchableOpacity>
          <Text className="font-HostGorteskBold text-xl">
            <Text className="text-blue-600">PEER</Text>CONNECT
          </Text>
        </View>
        <View className="flex-row gap-6 items-center">
          <MessageCircleQuestion color={"black"} size={22} />
          <TouchableOpacity onPress={() => router.push("/(root)/notification")}>
            <BellIcon color={"black"} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-2 py-4">
          <ImageCarousel />

          {/* Menu Grid */}
          <View className="my-6 px-2">
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
          {/* Footer Area */}
          <View className="p-2 my-8">
            <Text className="text-5xl/tight font-HostGorteskBold text-gray-300">
              Send, Travel &
            </Text>
            <Text className="text-5xl font-HostGorteskBold text-gray-300">
              Earn.
            </Text>
            <Text className="text-gray-400 italic font-DMSansMedium text-lg">
              Built for modern senders and travelers.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
