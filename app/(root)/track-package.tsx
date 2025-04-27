import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import {
  ChevronLeft,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  MapPin,
  Circle,
} from "lucide-react-native";
import { router } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { timeAgo } from "@/utils/utils";
import { getPackagesByUserId } from "@/services/packageService";
import { PackageModel } from "@/models/packageModel";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchPackages = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const data = await getPackagesByUserId(user.id);
      // Sort by createdAt descending (latest first)
      setPackages(
        [...data].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
      );
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
            fetchPackages();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (packageId: string) => {
    // router.push(`/edit-package/${packageId}`); // ✅ Assumes you have a dynamic route to edit
  };

  const handleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
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
        <View className="flex-row items-center py-2 gap-1">
          <ChevronLeft color={"black"} size={20} />
          <Text className="font-DMSansMedium text-lg">Back</Text>
        </View>
      </TouchableOpacity>

      <View className="mt-4 mb-2">
        <Text className="text-xl font-HostGorteskBold">
          Track your packages
        </Text>
      </View>

      <FlatList
        data={packages}
        className="mt-4"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        extraData={expanded}
        renderItem={({ item }) => {
          const isOpen = expanded === item.id;
          return (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => handleExpand(item.id)}
              className="mb-4"
            >
              <View
                className={`bg-white rounded-2xl border border-gray-200 px-5 py-4`}
              >
                {/* Minimal Info */}
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-HostGorteskBold">
                      {item.packageInfo?.type || "Package"}
                    </Text>
                    <Text className="font-DMSansMedium text-gray-700">
                      {item.packageInfo?.pickupLocation?.city +
                        `, ` +
                        item.packageInfo?.pickupLocation?.state}{" "}
                      →{" "}
                      {item.packageInfo?.deliveryLocation?.city ||
                        item.packageInfo?.deliveryLocation?.state}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {/* Expand/Collapse Icon */}
                    {isOpen ? (
                      <ChevronUp size={22} color="#2563eb" className="ml-2" />
                    ) : (
                      <ChevronDown size={22} color="#2563eb" className="ml-2" />
                    )}
                  </View>
                </View>
                <View
                  className={`self-start px-3 py-0.5 rounded-full mt-2 border ${
                    item.status === "pending"
                      ? "border-yellow-300 bg-yellow-50"
                      : item.status === "approved"
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <Text
                    className={`font-DMSansSemiBold text-xs  ${
                      item.status === "pending"
                        ? "text-yellow-500"
                        : item.status === "approved"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </View>

                {/* Expanded Info */}
                {isOpen && (
                  <View className="mt-4">
                    <Text className="font-DMSansRegular text-gray-500 mb-1">
                      Posted: {timeAgo(item.createdAt || new Date())}
                    </Text>
                    <View className="flex-row items-stretch gap-3 mb-1">
                      <View className="items-center">
                        <MapPin color="#2563eb" size={20} />
                        <View
                          style={{
                            width: 1,
                            height: 40,
                            borderStyle: "dotted",
                            borderLeftWidth: 1.5,
                            borderColor: "#a3a3a3",
                          }}
                        />
                        <Circle color="#000000" size={16} />
                      </View>
                      <View className="flex-1 justify-between py-0.5">
                        <Text className="font-DMSansMedium text-gray-800 mb-2">
                          {item.packageInfo?.pickupLocation?.address || "-"}
                        </Text>
                        <Text className="font-DMSansMedium text-gray-800">
                          {item.packageInfo?.deliveryLocation?.address || "-"}
                        </Text>
                      </View>
                    </View>
                    <View className="mt-4">
                      <Text className="font-DMSansSemiBold">Content:</Text>
                      <Text className="font-DMSansRegular mb-1">
                        {item.packageInfo?.content}
                      </Text>
                    </View>
                    <View className="flex-row gap-3 mt-4">
                      <TouchableOpacity
                        className="bg-red-100 rounded-full p-3"
                        onPress={() => handleDelete(item.id)}
                      >
                        <Trash2 color="#dc2626" size={22} />
                      </TouchableOpacity>
                      {item.status === "pending" && (
                        <TouchableOpacity
                          className="bg-blue-100 rounded-full p-3"
                          onPress={() => handleEdit(item.id)}
                        >
                          <Pencil color="#2563eb" size={22} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default TrackPackage;
