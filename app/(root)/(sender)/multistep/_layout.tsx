import { router, Stack, useSegments } from "expo-router";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import StepProgressBar from "@/components/stepProgressBar";
import { ChevronLeft } from "lucide-react-native";
import CustomButton from "@/components/customButton";
import React from "react";

const steps = ["Location", "Package", "Receiver", "Summary"];

const Layout = () => {
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
      </Stack>

      <View className="p-4">
        {currentStepIndex <= 3 && (
          <CustomButton
            title={currentStepIndex === 3 ? "Submit" : "Next"}
            onPress={() => router.push(route)}
          />
        )}
      </View>
    </View>
  );
};

export default Layout;
