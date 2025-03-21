// /app/traveller/step3.tsx
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/customButton";
import { useRouter } from "expo-router";
import { useTravellerForm } from "@/app/contex/TravelerFormContex";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type SenderData = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
};

const TravellerStep3 = () => {
  const router = useRouter();
  const { formData } = useTravellerForm();
  const [userData, setUserData] = useState<any>(null);
  const selectedPackage = formData.selectedPackage;
  console.log(selectedPackage.userId);

  const handleConfirm = () => {
    alert("Package selection confirmed!");
    router.replace("/home"); // Navigate as desired after confirmation
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the document reference using the Clerk user ID
        const userDocRef = doc(db, "users", selectedPackage.userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          Alert.alert(
            "No Data",
            "User profile does not exist in the database."
          );
        }
      } catch (error: any) {
        Alert.alert("Error Fetching Profile", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView>
        <Text className="text-3xl font-HostGorteskBold mb-6">Summary</Text>
        {selectedPackage ? (
          <View>
            <Text className="text-lg font-HostGorteskBold mt-4">
              Package Details
            </Text>
            <Text>Type: {selectedPackage.packageDetails?.packageType}</Text>
            <Text>Size: {selectedPackage.packageDetails?.packageSize}</Text>
            <Text>Weight: {selectedPackage.packageDetails?.packageWeight}</Text>
            <Text>
              Content: {selectedPackage.packageDetails?.packageContent}
            </Text>
            <Text>
              Waiting Period: {selectedPackage.packageDetails?.waitingPeriod}
            </Text>

            <Text className="text-lg font-HostGorteskBold mt-4">
              Location Information
            </Text>
            <Text>Pickup: {selectedPackage.locationInfo?.pickupPoint}</Text>
            <Text>Delivery: {selectedPackage.locationInfo?.deliveryPoint}</Text>

            <Text className="text-lg font-HostGorteskBold mt-4">
              Sender's Details
            </Text>
            <Text>Sender Full Name: {userData?.fullName}</Text>
            <Text>Sender Full Name: {userData?.phoneNumber}</Text>
            <Text>Sender Email: {userData?.email}</Text>

            <Text className="text-lg font-HostGorteskBold mt-4">
              Receiver's Infromation
            </Text>
            <Text>
              Receiver Name: {selectedPackage.receiverDetails?.receiverName}
            </Text>
            <Text>
              Receiver Phone: {selectedPackage.receiverDetails?.receiverPhone}
            </Text>
          </View>
        ) : (
          <Text>No package selected</Text>
        )}
      </ScrollView>
      <CustomButton title="Confirm" onPress={handleConfirm} />
    </SafeAreaView>
  );
};

export default TravellerStep3;
