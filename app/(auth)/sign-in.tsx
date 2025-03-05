import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import OAuth from "@/components/oAuth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

const SignIn = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = FIREBASE_AUTH;

  // const handleSignup = () => {
  //   auth.s
  // };
  // auth
  //   .signInWithEmailAndPassword(userName, password)
  //   .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     console.log(user);
  //     router.push("/(root)/home");
  //   })
  //   .catch((error) => {
  //     const errorMessage = error.message;
  //     console.log(errorMessage);
  //     setError(errorMessage))
  // }  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 bg-white">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-HostGorteskBold">Welcome!</Text>
          <Text className="text-4xl font-HostGorteskBold">
            Great To See You
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
        <CustomButton title="Sign In" className="mt-8" onPress={handleSignup} />

        {/* Google OAuth */}
        <OAuth />

        {/* Login Link */}
        <View className="mt-4 mb-8 flex-row justify-center">
          <Text className="text-sm text-gray-500 font-DMSansRegular">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/sign-up");
            }}
          >
            <Text className="text-sm text-purple-600 font-DMSansSemiBold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
