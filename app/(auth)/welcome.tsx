import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { useRef, useState, useCallback, useMemo } from "react";
import CustomButton from "@/components/customButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";

const Welcome = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = useMemo(
    () => activeIndex === onboarding.length - 1,
    [activeIndex]
  );

  // Optimize state update for index change
  const handleIndexChanged = useCallback((index) => {
    setActiveIndex(index);
  }, []);

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

      {/* Pagination Dots */}
      <View className="absolute top-14 w-[90%] mx-auto flex-row justify-between items-center">
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
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="mb-8"
      />
    </SafeAreaView>
  );
};

export default Welcome;
