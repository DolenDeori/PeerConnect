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
        const kycDocRef = doc(db, "kyc", user.id);
        const kycSnap = await getDoc(kycDocRef);
        if (!kycSnap.exists()) {
          // No KYC record, start KYC process
          router.replace("/(root)/(kyc)/(multistep)/step1");
        } else {
          const kycData = kycSnap.data();
          if (kycData.status === "approved") {
            router.replace("/step1");
          } else if (kycData.status === "pending" || kycData.status === "rejected") {
            router.replace({
              pathname: "/kyc-pending",
              params: { status: kycData.status }
            });
          }
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
