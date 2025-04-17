import { View, Text, Animated, Easing, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";

interface Props {
  currentStep: number;
  steps: string[];
}

const StepProgressBar = ({ currentStep, steps }: Props) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepWidth = Dimensions.get("window").width / steps.length;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [currentStep]);

  return (
    <View className="p-4">
      {/* Step line container */}
      <View className="relative h-6 justify-center">
        {/* Gray background line */}
        <View className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 rounded-full" />

        {/* Green animated progress line */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            height: 4,
            backgroundColor: "#22c55e", // Tailwind green-500
            borderRadius: 9999,
            width: progressAnim.interpolate({
              inputRange: [0, steps.length - 1],
              outputRange: [stepWidth / 2, stepWidth * (steps.length - 0.5)],
              extrapolate: "clamp",
            }),
          }}
        />

        {/* Step circles */}
        <View className="flex-row justify-between items-center">
          {steps.map((_, index) => {
            const isCompleted = index <= currentStep;
            return (
              <View
                key={index}
                className={`w-6 h-6 rounded-full z-10 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            );
          })}
        </View>
      </View>

      {/* Step labels */}
      <View className="flex-row justify-between mt-2">
        {steps.map((label, index) => (
          <Text
            key={index}
            className={`text-xs text-center flex-1 ${
              index === currentStep
                ? "text-green-600 font-DMSansRegular"
                : "text-gray-500"
            }`}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default StepProgressBar;
