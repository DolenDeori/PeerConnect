import React, { createContext, useState, useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

function PackageInfoForm() {
  const [itemForm, setItemForm] = useState({
    pickUpLocation: "",
    dropLocation: "",
    packageType: "",
    packageSize: "",
  });

  return (
    <SafeAreaView>
      <View className="bg-gray-200 p-2 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="flex-row items-center gap-1">
            <ChevronLeft color={"black"} size={20} />
            <Text className="font-DMSansMedium">Back</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PackageInfoForm;
