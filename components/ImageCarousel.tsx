import * as React from "react";
import { Dimensions, View, Image } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { swiperImages } from "@/constant";

const { width } = Dimensions.get("window");

export default function ImageCarousel() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="items-center">
      <Carousel
        ref={ref}
        width={width}
        height={180}
        autoPlay
        autoPlayInterval={3000}
        loop
        data={swiperImages}
        onProgressChange={progress}
        scrollAnimationDuration={250}
        style={{ overflow: "visible" }}
        renderItem={({ item }) => (
          <View className="mx-4">
            <Image
              source={{ uri: item.uri }}
              className="rounded-2xl w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={swiperImages}
        dotStyle={{
          width: 4,
          height: 4,
          borderRadius: 9999,
          backgroundColor: "#7c3aed", // Purple-ish
          marginHorizontal: 4,
        }}
        containerStyle={{ marginTop: 12 }}
        onPress={onPressPagination}
      />
    </View>
  );
}
