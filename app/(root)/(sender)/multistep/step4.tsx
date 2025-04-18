import React from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Step4 = () => {
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text>Package Information will apppear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step4;
