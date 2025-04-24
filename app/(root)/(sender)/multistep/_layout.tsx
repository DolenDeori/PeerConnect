import { router, Stack, useSegments } from "expo-router";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import StepProgressBar from "@/components/stepProgressBar";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { useNavigationStore } from "@/store";

const steps = ["Location", "Package", "Receiver", "Summary"];

const Layout = () => {
  const handleNext = useNavigationStore((state) => state.handleNext); // get the handleNext function from the store
  const segments = useSegments(); // get the current route segments

  const currentSegment = segments[segments.length - 1]; // e.g., "step2"
  const currentStepIndex = steps.findIndex(
    (_, i) => `step${i + 1}` === currentSegment
  );

  const route = `/multistep/step${currentStepIndex + 2}`;

  return (
    <View className="bg-white flex-1">
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row gap-1 items-center p-2"
      >
        <ChevronLeft color={"black"} size={20} />
        <Text className="font-HostGorteskMedium">Back</Text>
      </TouchableOpacity>

      <StepProgressBar currentStep={currentStepIndex} steps={steps} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="step1" options={{ headerShown: false }} />
        <Stack.Screen name="step2" options={{ headerShown: false }} />
        <Stack.Screen name="step3" options={{ headerShown: false }} />
        <Stack.Screen name="step4" options={{ headerShown: false }} />
        <Stack.Screen name="add-location" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default Layout;
