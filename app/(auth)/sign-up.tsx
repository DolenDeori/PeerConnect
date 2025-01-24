import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import InputField from "@/components/inputField";
import { CheckBox } from "react-native-elements";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
            Just Few Steps to
          </Text>
          <Text className="text-4xl font-HostGorteskBold mb-2">
            Setup Your Account
          </Text>
          <Text className="text-gray-500 font-DMSansRegular">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </Text>
        </View>

        {/* Form Fields */}
        <View>
          <View className="flex-row justify-between">
            <InputField
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              containerClassName="flex-1 mr-2"
            />
            <InputField
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              containerClassName="flex-1 ml-2"
            />
          </View>
          <InputField
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          <InputField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            error={error}
          />
        </View>

        {/* Terms & Conditions */}
        <View className="flex-row items-center justify-center my-4 ">
          <CheckBox
            checked={isTermsAccepted}
            onPress={() => setTermsAccepted(!isTermsAccepted)}
            containerStyle={{ padding: 0, marginRight: 2 }}
          />
          <Text className="text-sm font-DMSansRegular pr-2">
            I agree to the{" "}
            <Text className="font-semibold text-purple-600">
              Terms & Conditions
            </Text>{" "}
            and{" "}
            <Text className="font-semibold text-purple-600">
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Submit Button */}
        <CustomButton title="Create Account" />

        {/* Login Link */}
        <View className="mt-4 flex-row justify-center">
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
    </ScrollView>
  );
};

export default SignUp;
