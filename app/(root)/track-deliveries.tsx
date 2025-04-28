import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // your Firestore config
import { PackageModel } from "@/models/packageModel"; // adjust the import path as needed
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TravelModel } from "@/models/travelModel";
import {
  IndianRupee,
  MapPin,
  User,
  UserCheck,
  ArrowRight,
  BadgeCheck,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react-native";
import { getUserById } from "@/services/userService";

type PackageWithTravelId = PackageModel & {
  travelId?: string | null;
  senderInfo?: any;
  receiverInfo?: any;
};

const TrackDeliveris = () => {
  const { user } = useUser();
  const [inTransitPackages, setInTransitPackages] = useState<
    PackageWithTravelId[]
  >([]);
  const [deliveredPackages, setDeliveredPackages] = useState<
    PackageWithTravelId[]
  >([]);
  const [travels, setTravels] = useState<TravelModel[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Wait for user to be loaded

    const fetchPackages = async () => {
      try {
        // Step 1: Fetch packages
        const packageQuery = query(
          collection(db, "packages"),
          where("travelerId", "==", user?.id)
        );
        const packageSnapshot = await getDocs(packageQuery);
        const packages: PackageModel[] = [];

        packageSnapshot.forEach((doc) => {
          packages.push({ ...(doc.data() as PackageModel), id: doc.id });
        });

        // Step 2: Fetch travels
        const travelQuery = query(
          collection(db, "travels"),
          where("travelerId", "==", user?.id)
        );
        const travelSnapshot = await getDocs(travelQuery);
        const travels = travelSnapshot.docs.map((doc) => ({
          travelId: doc.id,
          ...doc.data(),
        })) as TravelModel[];

        // Step 3: Match travelId to each package
        const packagesWithTravelId = packages.map((pkg) => {
          const matchedTravel = travels.find(
            (travel) => travel.packageId === pkg.id
          );
          return {
            ...pkg,
            travelId: matchedTravel?.travelId ?? null,
          };
        });

        // Step 4: Fetch user info for each package
        const receiverInfo = await getUserById(user.id);
        const packagesWithUserInfo = await Promise.all(
          packagesWithTravelId.map(async (pkg) => {
            // Fetch sender info
            let senderInfo = {};
            if (pkg.senderId) {
              const senderSnap = await getDocs(
                query(collection(db, "users"), where("id", "==", pkg.senderId))
              );
              if (!senderSnap.empty) {
                senderInfo = senderSnap.docs[0].data();
              }
            }
            return {
              ...pkg,
              travelId:
                travels.find((t) => t.packageId === pkg.id)?.travelId ?? null,
              senderInfo,
              receiverInfo,
            };
          })
        );

        // Step 5: Filter and update state
        setInTransitPackages(
          packagesWithUserInfo.filter((p) => {
            const matchedTravel = travels.find((t) => t.packageId === p.id);
            return matchedTravel?.travelStatus === "pending";
          }) as PackageWithTravelId[]
        );
        setDeliveredPackages(
          packagesWithUserInfo.filter((p) => {
            const matchedTravel = travels.find((t) => t.packageId === p.id);
            return matchedTravel?.travelStatus === "completed";
          }) as PackageWithTravelId[]
        );
        setTravels(travels);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch packages or travels", error);
      }
    };

    fetchPackages();
  }, [user]);

  const statusBadge = (status: TravelModel["travelStatus"]) => {
    let color = "#d1d5db"; // default gray
    let text = status;
    let icon = null;
    switch (status) {
      case "pending":
        color = "#fbbf24"; // yellow
        text = "pending";
        icon = <Clock size={16} color={color} style={{ marginRight: 4 }} />;
        break;
      case "in-progress":
        color = "#2563eb"; // blue
        text = "in-progress";
        icon = (
          <BadgeCheck size={16} color={color} style={{ marginRight: 4 }} />
        );
        break;
      case "completed":
        color = "#10b981"; // green
        text = "completed";
        icon = (
          <CheckCircle2 size={16} color={color} style={{ marginRight: 4 }} />
        );
        break;
      case "cancelled":
        color = "#ef4444"; // red
        text = "cancelled";
        icon = <XCircle size={16} color={color} style={{ marginRight: 4 }} />;
        break;
      default:
        color = "#d1d5db";
        text = status;
        icon = null;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: color + "22",
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 2,
          alignSelf: "flex-start",
          marginTop: 4,
        }}
      >
        {icon}
        <Text style={{ color, fontWeight: "bold", fontSize: 13 }}>{text}</Text>
      </View>
    );
  };

  const renderPackageItem = (item: PackageWithTravelId) => {
    const travel =
      item.travelId && travels.find((t) => t.travelId === item.travelId);
    return (
      <TouchableOpacity
        className="bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
        onPress={() => {
          if (!item.travelId) return;
          router.push({
            pathname: "/traveller-journey",
            params: {
              travelId: item.travelId,
              destLat: item.packageInfo.deliveryLocation.latitude.toString(),
              destLng: item.packageInfo.deliveryLocation.longitude.toString(),
              packageId: item.id,
            },
          });
        }}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center mb-1">
          <Text className="font-HostGorteskBold text-base mr-2">
            {item.trackingNumber}
          </Text>
          {travel && statusBadge(travel.travelStatus)}
        </View>
        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="#2563eb" style={{ marginRight: 2 }} />
          <Text className="text-gray-700 font-DMSansMedium mr-1">
            {item.packageInfo.pickupLocation.city}
          </Text>
          <ArrowRight
            size={16}
            color="#6b7280"
            style={{ marginHorizontal: 2 }}
          />
          <Text className="text-gray-700 font-DMSansMedium">
            {item.packageInfo.deliveryLocation.city}
          </Text>
        </View>
        <View className="flex-row items-center mb-1">
          <User size={14} color="#2563eb" style={{ marginRight: 2 }} />
          <Text className="text-xs text-gray-500 mr-2">
            Sender:{" "}
            {item.senderInfo?.fullName || item.senderInfo?.userName || "-"}
          </Text>
          <UserCheck size={14} color="#10b981" style={{ marginRight: 2 }} />
          <Text className="text-xs text-gray-500">
            Receiver:{" "}
            {item.receiverInfo?.firstName && item.receiverInfo?.lastName
              ? `${item.receiverInfo.firstName} ${item.receiverInfo.lastName}`
              : item.receiverInfo?.name || item.receiverInfo?.username || "-"}
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <IndianRupee size={14} color="#10b981" style={{ marginRight: 2 }} />
          <Text className="text-xs text-green-700 font-bold">
            {travel && typeof travel === "object" && "price" in travel
              ? `₹${travel.price}`
              : "-"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-3">Ongoing Deliveries</Text>
      {inTransitPackages.length > 0 ? (
        <FlatList
          data={inTransitPackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderPackageItem(item)}
        />
      ) : (
        <Text className="text-gray-500 mb-6">No ongoing deliveries.</Text>
      )}

      <Text className="text-xl font-bold mt-6 mb-3">Completed Deliveries</Text>
      {deliveredPackages.length > 0 ? (
        <FlatList
          data={deliveredPackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderPackageItem(item)}
        />
      ) : (
        <Text className="text-gray-500">No completed deliveries yet.</Text>
      )}
    </SafeAreaView>
  );
};

export default TrackDeliveris;
