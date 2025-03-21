import React, { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";

const TravellerRoot = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKYC = async () => {
      if (!user || !user.id) {
        Alert.alert("Error", "User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const userDocRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Assume valid KYC means a truthy value at userData.kyc?.isValid
          if (!userData.kyc || !userData.kyc.isValid) {
            router.replace("/kyc"); // Redirect to KYC flow if not valid
          } else {
            router.replace("/step1");
          }
        } else {
          Alert.alert("Error", "User data not found");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };
    checkKYC();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return null;
};

export default TravellerRoot;
