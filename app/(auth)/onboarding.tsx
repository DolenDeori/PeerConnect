import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { router } from "expo-router";
import { onboarding } from "@/constant";
import CustomButton from "@/components/customButton";

const Onboarding = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = useMemo(
    () => activeIndex === onboarding.length - 1,
    [activeIndex]
  );

  // Optimize state update for index change
  const handleIndexChanged = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        className="w-full flex justify-end items-end p-3 px-4"
        onPress={() => {
          router.replace("/(auth)/welcome-auth");
        }}
      >
        <Text className="text-black text-md font-DMSansSemiBold">Skip</Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View className="absolute top-14 w-[95%] mx-auto flex-row justify-between items-center">
        {Array.from({ length: onboarding.length }, (_, index) => {
          const isActive = activeIndex === index;
          return (
            <View
              key={index}
              className={`h-[4px] rounded-full mx-[2px] ${
                isActive ? "bg-[#0286FF]" : "bg-[#E2E8F0]"
              }`}
              style={{
                flex: 1, // Active dot is twice as wide
              }}
            />
          );
        })}
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={handleIndexChanged}
      >
        {onboarding.map((item) => (
          <View key={item.id}>
            <Image
              source={item.image}
              className="w-full h-[300px] mt-16 items-center justify-center px-4"
              resizeMode="contain"
            />
            <View className="mt-10 px-4">
              <View>
                <Text className="text-black font-HostGorteskBold text-4xl">
                  {item.title}
                </Text>
                <Text className="mt-2 font-DMSansRegular">
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
      <View className="mb-8 w-full px-4">
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          onPress={() =>
            isLastSlide
              ? router.replace("/(auth)/welcome-auth")
              : swiperRef.current?.scrollBy(1)
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
