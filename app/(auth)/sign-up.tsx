import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { router, useRouter } from "expo-router";
import OAuth from "@/components/oAuth";
import { useSignUp } from "@clerk/clerk-expo";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [pendingVerification, setPendingVerification] =
    React.useState<boolean>(false);
  const [code, setCode] = useState("");

  // Handle signup logic for the application
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </>
    );
  }

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

          {/* --------------- Form Fields ------------------------ */}
          <View className="mt-8">
            <InputField
              placeholder="Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              error={error}
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
          <CustomButton title="Next" onPress={onSignUpPress} className="mt-4" />

          {/* Google OAuth */}
          <OAuth />

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
