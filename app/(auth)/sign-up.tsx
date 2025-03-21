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
import { useSignUp } from "@clerk/clerk-expo";
import OAuth from "@/components/oAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ReactNativeModal from "react-native-modal";
import { icons, images } from "@/constant";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [error, setError] = useState<string>("");
  const { isLoaded, signUp, setActive } = useSignUp();
  // const { isSignedIn, user } = useUser();

  const validateEmail = (email: string): boolean => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleSignup = async () => {
    if (!isLoaded) return;
    if (!validateEmail(form.email)) {
      Alert.alert("Invalid Email, Please enter a valid email address.");
      return;
    }
    // Validate password match.
    if (form.password !== form.confirmPassword) {
      Alert.alert("Password Mismatch, Passwords do not match.");
      return;
    }
    // (Optional) Check for a minimum password length.
    if (form.password.length < 6) {
      Alert.alert(
        "Weak Password, Password must be at least 6 characters long."
      );
      return;
    }

    try {
      
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // send user a verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // set the verification status
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (error) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        const partialUserData = {
          email: form.email,
          role: "sender",
          createdAt: new Date().toISOString(),
        };

        // create a firestore document with clerk userID
        await setDoc(
          doc(db, "users", `${signUpAttempt.createdUserId}`),
          partialUserData
        );

        // make the session active for that user
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "verification failed",
          state: "failed",
        });
      }
    } catch (err) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
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
              Create your account
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mt-8">
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value: string) =>
                setForm({ ...form, email: value })
              }
            />
            <InputField
              label="Create Password"
              placeholder="Create Password"
              value={form.password}
              onChangeText={(value: string) =>
                setForm({ ...form, password: value })
              }
              isPassword
              error={error}
            />
            <InputField
              label="Confirm Password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(value: string) =>
                setForm({ ...form, confirmPassword: value })
              }
              isPassword
              error={error}
            />
          </View>

          {/* Submit Button */}
          <CustomButton title="Next" onPress={handleSignup} className="mt-4" />

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
              // icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code: any) =>
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
              title="Next"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(auth)/extra-info");
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
