// /app/traveller/step3.tsx
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type SenderData = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
};

const TravellerStep3 = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  const handleConfirm = () => {
    alert("Package selection confirmed!");
    router.replace("/home"); // Navigate as desired after confirmation
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <CustomButton title="Confirm" onPress={handleConfirm} />
    </SafeAreaView>
  );
};

export default TravellerStep3;
