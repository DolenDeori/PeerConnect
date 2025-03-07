import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import { useState } from "react";
import CustomButton from "@/components/customButton";
import CustomInput from "@/components/customInput";
import InputField from "@/components/inputField";

const travellerForm = () => {
  const [travelMedium, setTravelMedium] = useState("bus");
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white px-5 pt-10 dark:bg-gray-900">
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-5"
        >
          <ChevronLeftIcon size={24} color="black" />
          <Text className="text-lg font-semibold ml-2 text-black dark:text-white">
            Go back
          </Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black dark:text-white font-HostGorteskBold">
          Ready to help Someone Today
        </Text>
        <Text className="text-gray-600 mt-2 dark:text-gray-300 font-DMSansRegular">
          We need some information about your package to ship it properly
          through a traveler.
        </Text>
        {/* Form Fields */}
        <View className="mt-6">
          <View>
            <InputField
              label="Current Location"
              placeholder="Select your current location"
            />
          </View>

          <View>
            <InputField
              label="Destination Location"
              placeholder="Select your destination location"
            />
          </View>

          <View>
            <InputField
              label="Your Travelling Medium"
              placeholder="Select a travelling medium"
              value={travelMedium}
            />
            <View className="bg-gray-200 dark:bg-gray-800 rounded-lg mb-2">
              <Picker
                onValueChange={(itemValue: string) =>
                  setTravelMedium(itemValue)
                }
              >
                <Picker.Item label="Bus" value="bus" />
                <Picker.Item label="Car" value="car" />
                <Picker.Item label="Train" value="train" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View>
            <InputField
              label="Traveling date"
              placeholder="Select date & time"
            />
          </View>
        </View>
        {/* Next Button */}
        <View>
          <CustomButton
            title="Next"
            onPress={() => router.push("/(root)/travelerItemsList")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default travellerForm;
