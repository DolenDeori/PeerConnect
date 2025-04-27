import { Stack } from "expo-router";
import { View } from "react-native";
import { useKYCFormStore } from "@/store/kycFormStore";

export default function KYCFormLayout() {
  const { currentStep } = useKYCFormStore();

  return (
    <View className="flex-1 bg-white">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      {/* Progress Indicator */}
      <View className="absolute top-0 left-0 right-0 flex-row justify-center items-center p-4 bg-white">
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            className={`h-2 w-2 rounded-full mx-1 ${
              step <= currentStep ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
