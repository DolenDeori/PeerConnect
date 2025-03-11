import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/inputField";
import { db } from "@/firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import CustomButton from "@/components/customButton";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const ExtraInfo = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const onFormSubmitPress = async () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert(
        "Missing Information",
        "Please enter both your first name and last name."
      );
      return;
    }
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const userName = fullName.toLowerCase().replace(/\s+/g, "");

    try {
      if (!user || !user.id) {
        Alert.alert("User Error", "User information is not available.");
        return;
      }

      // Update the existing user table
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        fullName,
        userName,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber,
      });

      Alert.alert(
        "Profile Created",
        "Your profile has been created successfully."
      );

      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      Alert.alert("Error Updating Profile", error.errors[0].longMessage);
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="h-full w-full px-6 pt-8">
        <Text className="text-3xl font-HostGorteskBold">
          Additinonal Information
        </Text>
        <Text className="text font-DMSansRegular">
          We need some additionl information to continue
        </Text>
        <View className="mt-8">
          <InputField
            label="First Name"
            placeholder="Enter First name"
            value={form.firstName}
            onChangeText={(value: string) =>
              setForm({ ...form, firstName: value })
            }
          />
          <InputField
            label="Last Name"
            placeholder="Enter First name"
            value={form.lastName}
            onChangeText={(value: string) =>
              setForm({ ...form, lastName: value })
            }
          />
          <InputField
            label="Phone Number"
            placeholder="Enter Phone Number"
            value={form.phoneNumber}
            onChangeText={(value: string) =>
              setForm({ ...form, phoneNumber: value })
            }
          />
        </View>
        <CustomButton title="Create Account" onPress={onFormSubmitPress} />
      </View>
    </SafeAreaView>
  );
};

export default ExtraInfo;
