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
import CustomButton from "@/components/customButton";
import { useForm } from "@/app/contex/FormContex";
import { ChevronDown, ChevronLeft, X } from "lucide-react-native";
import { dropdownOptions } from "@/constant";
import StepProgressBar from "@/components/stepProgressBar";

const Step2 = () => {
  const steps = ["Location", "Package", "Receiver", "Summary"];
  const router = useRouter();
  const { formData, updateFormData } = useForm();

  // Local states for dropdowns and text inputs
  const [packageType, setPackageType] = useState(
    formData.packageDetails.packageType
  );
  const [packageSize, setPackageSize] = useState(
    formData.packageDetails.packageSize
  );
  const [packageWeight, setPackageWeight] = useState(
    formData.packageDetails.packageWeight
  );
  const [packageContent, setPackageContent] = useState(
    formData.packageDetails.packageContent
  );
  const [waitingPeriod, setWaitingPeriod] = useState(
    formData.packageDetails.waitingPeriod
  );

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

  const handleNext = () => {
    updateFormData("packageDetails", {
      packageType,
      packageSize,
      packageWeight,
      packageContent,
      waitingPeriod,
    });
    router.push("/multistep/step3");
  };

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
            value={packageType}
            placeholder="Select Package Type"
            dropdownKey="packageType"
          />
          <CustomDropdown
            label="Package Size"
            value={packageSize}
            placeholder="Select Package Size"
            dropdownKey="packageSize"
          />
          <CustomDropdown
            label="Package Weight"
            value={packageWeight}
            placeholder="Select Package Weight"
            dropdownKey="packageWeight"
          />
          <CustomDropdown
            label="Package Content"
            value={packageContent}
            placeholder="Select Package Content"
            dropdownKey="packageContent"
          />
          <CustomDropdown
            label="Waiting Period"
            value={waitingPeriod}
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
