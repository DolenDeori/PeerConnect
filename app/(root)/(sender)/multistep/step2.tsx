import React, { useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronDown, X } from "lucide-react-native";
import { dropdownOptions } from "@/constant";
import { SenderFormData } from "@/validation";
import { useFormStore } from "@/store";

const Step2 = () => {
  const steps = ["Location", "Package", "Receiver", "Summary"];
  const router = useRouter();
  const { data, updateData } = useFormStore();

  // Local states for dropdowns and text inputs
  const [packageType, setPackageType] = useState(data.pickupLocation);
  const [packageSize, setPackageSize] = useState(data.deliveryLocation);
  const [packageWeight, setPackageWeight] = useState(data.packageWeight);
  const [packageContent, setPackageContent] = useState(data.packageContent);
  const [waitingPeriod, setWaitingPeriod] = useState(data.deliveryLocation);

  // Dropdown modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (!activeDropdown) return;
    switch (activeDropdown) {
      case "packageType":
        setPackageType(value);
        break;
      case "packageSize":
        setPackageSize(value);
        break;
      case "packageWeight":
        setPackageWeight(value);
        break;
      case "packageContent":
        setPackageContent(value);
        break;
      case "waitingPeriod":
        setWaitingPeriod(value);
        break;
    }
    setModalVisible(false);
    setActiveDropdown(null);
  };

  // Custom Dropdown component using NativeWind classes
  const CustomDropdown = ({
    label,
    value,
    placeholder,
    dropdownKey,
  }: {
    label: string;
    value: string;
    placeholder: string;
    dropdownKey: string;
  }) => (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-2 font-DMSansSemiBold">
        {label}
      </Text>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 rounded-lg p-4"
        onPress={() => {
          setActiveDropdown(dropdownKey);
          setModalVisible(true);
        }}
      >
        <Text className={`text-lg ${value ? "text-black" : "text-gray-400"}`}>
          {value || placeholder}
        </Text>
        <ChevronDown color={"black"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-5">
          <Text className="text-3xl font-HostGorteskBold">Package Details</Text>
          <Text className="font-DMSansRegular">Enter your package detail</Text>
        </View>
        <View className="mt-6">
          <CustomDropdown
            label="Package Type"
            value={packageType as string}
            placeholder="Select Package Type"
            dropdownKey="packageType"
          />
          <CustomDropdown
            label="Package Size"
            value={packageSize as string}
            placeholder="Select Package Size"
            dropdownKey="packageSize"
          />
          <CustomDropdown
            label="Package Weight"
            value={packageWeight as string}
            placeholder="Select Package Weight"
            dropdownKey="packageWeight"
          />
          <CustomDropdown
            label="Package Content"
            value={packageContent as string}
            placeholder="Select Package Content"
            dropdownKey="packageContent"
          />
          <CustomDropdown
            label="Waiting Period"
            value={waitingPeriod as string}
            placeholder="Select Waiting Period"
            dropdownKey="waitingPeriod"
          />
        </View>
      </ScrollView>
      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setActiveDropdown(null);
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-100 shadow-xl rounded-t-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-DMSansSemiBold">Select Option</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setActiveDropdown(null);
                }}
              >
                <X color={"black"} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                activeDropdown
                  ? dropdownOptions[
                      activeDropdown as keyof typeof dropdownOptions
                    ]
                  : []
              }
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <View className="py-4">
                  <TouchableOpacity onPress={() => handleSelect(item.label)}>
                    <Text className="font-DMSansRegular">{item.label}</Text>
                  </TouchableOpacity>
                </View>
              )}
              className="max-h-72"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Step2;
