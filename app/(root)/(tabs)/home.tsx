import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Handshake, LocateFixed, Package2, Truck } from "lucide-react-native";
import Map from "@/components/map";
import GoogleTextInput from "@/components/googleTextInput";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <GoogleTextInput />
      <View className="h-[40vh] w-full">
        <Map />
      </View>
    </SafeAreaView>
  );
};

export default Home;
