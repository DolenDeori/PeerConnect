import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { timeAgo } from "@/utils/utils";
import CustomButton from "@/components/customButton";
import { getPackagesByUserId } from "@/services/packageService"; // ✅ use service
import { PackageModel } from "@/models/packageModel"; // ✅ your package interface

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
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPackages = async () => {
    if (!user || !user.id) return;

    setLoading(true);
    try {
      const data = await getPackagesByUserId(user.id);
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  const handleDelete = (packageId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            await deleteItem(packageId);
            fetchPackages(); // ✅ Refresh list after deletion
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (packageId: string) => {
    // router.push(`/edit-package/${packageId}`); // ✅ Assumes you have a dynamic route to edit
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

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

      <View className="mt-4">
        <Text className="text-4xl font-HostGorteskBold">My Packages</Text>
      </View>

      <FlatList
        data={packages}
        className="mt-4"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b py-4">
            <Text className="text-lg font-DMSansSemiBold">
              {item.packageInfo?.type || "Package"}
            </Text>
            <Text className="font-DMSansRegular">
              {item.packageInfo?.pickupLocation?.city} →{" "}
              {item.packageInfo?.deliveryLocation?.city}
            </Text>

            <Text className="mt-1 font-DMSansRegular text-gray-500">
              Content: {item.packageInfo?.content}
            </Text>

            <Text className="mt-1 font-DMSansRegular">
              Status:{" "}
              <Text className="text-yellow-500 font-DMSansSemiBold">
                {item.status}
              </Text>
            </Text>

            <Text className="mt-1 font-DMSansRegular text-sm text-gray-500">
              Item Listed: {timeAgo(item.createdAt || new Date())}
            </Text>

            <View className="flex-row gap-3 mt-4">
              <CustomButton
                title="Delete"
                bgVariant="danger"
                onPress={() => handleDelete(item.id)}
              />
              {item.status === "pending" && (
                <CustomButton
                  title="Edit"
                  bgVariant="primary"
                  onPress={() => handleEdit(item.id)}
                />
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TrackPackage;
