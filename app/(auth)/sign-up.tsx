import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Button,
  Image,
} from "react-native";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import OAuth from "@/components/oAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constants";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const [error, setError] = React.useState("");
  const [pendingVerification, setPendingVerification] =
    React.useState<boolean>(false);

  // Handle signup logic for the application
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (error) {
      Alert.alert("Error", error.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });

        await setActive({ session: signUpAttempt.createdSessionId });

        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verification Failed",
          state: "failed",
        });
      }
    } catch (error) {
      setVerification({
        ...verification,
        error: error.errors[0].longMessage,
        state: "failed",
      });
    }
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

          {/* --------------- Form Fields ------------------------ */}
          <View className="mt-8">
            <InputField
              placeholder="Enter your name"
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
              error={error}
            />
            <InputField
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              error={error}
            />
            <InputField
              placeholder="Create Password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              isPassword
              error={error}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-4"
          />

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

        {/* Verification model */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="code"
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              bgVariant="success"
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              Your account has been verified successfully
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
