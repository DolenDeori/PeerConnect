import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import OAuth from "@/components/oAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const [error, setError] = useState("");
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // Handle the sign in logic for the application.
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, [isLoaded, emailAddress, password]);
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

        {/* -------------- Form Fields ---------------- */}
        <View>
          <InputField
            placeholder="Email Address"
            value={emailAddress}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />

          <InputField
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            isPassword
          />
        </View>

        <TouchableOpacity>
          <Text className="font-DMSansMedium">Forgot Password</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <CustomButton
          title="Sign In"
          className="mt-8"
          onPress={onSignInPress}
        />

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
