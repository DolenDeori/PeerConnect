import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import { icons } from "@/constants";

const SignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (password.length < 0) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    Alert.alert("Signup Successful", "Welcome to the app!");
    router.push("/(root)/(tabs)/home");
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Google Sign-In", "This feature is under development.");
  };

  return (
    <ScrollView className="bg-white">
      <View className="min-h-full flex justify-between">
        <View className="px-6 py-8 bg-white">
          {/* Header */}
          <View>
            <Text className="text-4xl font-HostGorteskBold">Welcome!</Text>
            <Text className="text-4xl font-HostGorteskBold">
              Just Few Steps to
            </Text>
            <Text className="text-4xl font-HostGorteskBold mb-2">
              Setup Your Account
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mt-8">
            <InputField
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <InputField
              placeholder="Create Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={error}
            />
            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={error}
            />
          </View>

          {/* Submit Button */}
          <CustomButton title="Next" onPress={handleSignup} className="mt-4" />

          {/* OR Separator */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-DMSansRegular">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google OAuth Button */}
          <CustomButton
            title="Sign in with Google"
            onPress={handleGoogleSignIn}
            bgVariant="outline"
            textVariant=""
            IconLeft={() => (
              <Image
                source={icons.google}
                resizeMode="contain"
                className="w-5 h-5 mx-2"
              />
            )}
          />

          {/* Login Link */}
          <View className="mt-4 mb-8 flex-row justify-center">
            <Text className="text-sm text-gray-500 font-DMSansRegular">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/sign-in");
              }}
            >
              <Text className="text-sm text-purple-600 font-DMSansSemiBold">
                login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View className="flex-row items-center justify-center mb-4 mx-4">
          <Text className="text-sm font-normal pr-2 font-DMSansRegular opacity-60">
            By continuing you agree to our{" "}
            <Text className="font-DMSansSemiBold text-purple-600">T&C</Text> and{" "}
            <Text className="font-DMSansSemiBold text-purple-600">
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
