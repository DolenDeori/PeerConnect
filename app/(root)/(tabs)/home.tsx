import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Handshake, LocateFixed, Package2, Truck } from "lucide-react-native";

const Home = () => {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white p-4">
        <View>
          <Text className="text-3xl font-HostGorteskBold">
            What you want to do
          </Text>
        </View>
        <View className="mt-5 flex-row flex-wrap gap-2 w-full">
          <TouchableOpacity
            onPress={() => router.push("/(root)/(traveler)/traveler")}
            className="p-4 bg-gray-200 h-20 flex flex-row gap-2 justify-center items-center flex-1 rounded-xl border-2 border-gray-600"
          >
            <Truck color={"black"} size={25} />
            <Text className="font-DMSansMedium">Deliver Package</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(root)/(sender)/multistep/step1")}
            className="p-4 bg-gray-200 h-20 flex flex-row gap-2 justify-center items-center flex-1 rounded-xl border-2 border-gray-600"
          >
            <Package2 color={"black"} size={25} />
            <Text className="font-DMSansMedium">Send Packge</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/receive-package")}
            className="p-4 bg-gray-200 h-20 flex flex-row gap-2 justify-center items-center flex-1 rounded-xl border-2 border-gray-600"
          >
            <Handshake color={"black"} size={25} />
            <Text className="font-DMSansMedium">Receive Package</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/track-package")}
            className="p-4 bg-gray-200 h-20 flex flex-row gap-2 justify-center items-center w-full rounded-xl border-2 border-gray-600"
          >
            <LocateFixed color={"black"} size={25} />
            <Text className="font-DMSansMedium">Track Package</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
