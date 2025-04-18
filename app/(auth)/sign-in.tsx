import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import OAuth from "@/components/oAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { signIn, setActive, isLoaded } = useSignIn();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSignInPress = async () => {
    setError("");
    setLoading(true);

    if (!isLoaded) {
      setLoading(false);
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        setError("Sign-in not completed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.errors[0].longMessage || "Something went wrong please try again.";
      setError(errorMessage);
    }

    setLoading(false);
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
        </View>

        {/* Form Fields */}
        <View>
          {error && (
            <View className="p-2 bg-red-100 mb-4 rounded">
              <Text className="font-DMSansRegular text-red-700">{error}</Text>
            </View>
          )}
          <InputField
            label="Enter Email"
            placeholder="Enter Email"
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
            onFocus={() => setError("")}
          />
          <InputField
            label="Enter Password"
            placeholder="Password"
            value={form.password}
            onFocus={() => setError("")}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
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
          loading={loading}
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
