import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { timeAgo } from "@/utils/utils";
import CustomButton from "@/components/customButton";

const deleteItem = async (itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "packages", itemId));
    Alert.alert("Item Deleted", "The item has been successfully deleted.");
  } catch (error: any) {
    Alert.alert("Error Deleting Item", error.message);
  }
};

const TrackPackage = () => {
  const { user } = useUser();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        // Create a query to fetch packages for the current user
        const q = query(
          collection(db, "packages"),
          where("userId", "==", user.id)
        );
        const querySnapshot = await getDocs(q);
        const packagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching packages: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [user, packages]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleDelete = (packageId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteItem(packageId),
          style: "destructive",
        },
      ]
    );
  };

  if (packages.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl">No packages found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="flex-row items-center py-2">
          <ChevronLeft color={"black"} />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <View className="mt-5">
        <Text className="text-3xl font-HostGorteskBold">My Packages</Text>
      </View>
      <FlatList
        data={packages}
        className="mt-4"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b">
            <Text className="text-lg font-DMSansSemiBold">
              {item.packageDetails?.packageType || "Package"}
            </Text>
            <Text className="font-DMSansRegular">
              {item.locationInfo?.pickupPoint} →{" "}
              {item.locationInfo?.deliveryPoint}
            </Text>
            {/* Render other package fields as needed */}
            <Text>
              Status:{" "}
              <Text className="text-yellow-200 font-DMSansSemiBold">
                Pending
              </Text>
            </Text>
            <View className="flex-row items-center">
              <Text className="mt-2 font-DMSansRegular text-sm text-gray-500">
                Item Listed: {timeAgo(item.createdAt)}
              </Text>
            </View>
            <View className="flex-row mt-4">
              <CustomButton
                title="Delete Item"
                bgVariant="danger"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TrackPackage;
