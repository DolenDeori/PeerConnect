import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import CustomButton from "@/components/customButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import Button from "@/components/button";

const Welcome = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        className="w-full flex justify-end items-end p-3 px-5"
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
      >
        <Text className="text-black text-md font-DMSansRegular font-bold">
          Skip
        </Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[50px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <View className="flex items-center justify-center w-full mt-10">
              <View className="px-5 mb-5">
                <Text className="text-black font-bold font-DMSansRegular text-4xl">
                  {item.title}
                </Text>
                <Text className="mt-2">{item.description}</Text>
              </View>

              <Image
                source={item.image}
                className="w-full h-[300px]"
                resizeMode="contain"
              />
            </View>
            <CustomButton
              title={isLastSlide ? "Get Started" : "Next"}
              onPress={() =>
                isLastSlide
                  ? router.replace("/(auth)/sign-up")
                  : swiperRef.current?.scrollBy(1)
              }
              className="mt-10"
            ></CustomButton>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

export default Welcome;
