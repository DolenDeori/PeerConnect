import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomButton from "@/components/customButton";
import { useAuth } from "@clerk/clerk-react";
import { router } from "expo-router";

const Home = () => {
  const { signOut } = useAuth();
  const onSginOutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in"); // Navigate to SignIn screen after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <View>
      <Text>This is Home</Text>
      <CustomButton
        title="Log Out"
        bgVariant="danger"
        onPress={onSginOutPress}
      />
    </View>
  );
};

export default Home;
