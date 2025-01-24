import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import InputField from "@/components/inputField";
import { CheckBox } from "react-native-elements";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";

const SignIn = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isTermsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
    setError("");
    Alert.alert("Signup Successful", "Welcome to the app!");
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 bg-white">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-HostGorteskBold">Welcome!</Text>
          <Text className="text-4xl font-HostGorteskBold">
            Great To See You
          </Text>
          <Text className="text-gray-500 font-DMSansRegular">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </Text>
        </View>

        {/* Form Fields */}
        <View>
          <InputField
            placeholder="User Name"
            value={userName}
            onChangeText={setUserName}
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
        </View>

        <TouchableOpacity>
          <Text className="font-DMSansMedium">Forgot Password</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <CustomButton title="Sign In" className="mt-8" />

        {/* Login Link */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-gray-500 font-DMSansRegular">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/sign-up");
            }}
          >
            <Text className="text-sm text-purple-600 font-DMSansSemiBold">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
