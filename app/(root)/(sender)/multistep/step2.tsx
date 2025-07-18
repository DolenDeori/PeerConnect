import React, { useCallback, useState } from "react";
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
import { useFormStore } from "@/store";
import CustomButton from "@/components/customButton";

const Step2 = () => {
  const router = useRouter();
  const { data, updateField } = useFormStore();

  const [packageType, setPackageType] = useState(data.packageType ?? "");
  const [packageSize, setPackageSize] = useState(data.packageSize ?? "");
  const [packageWeight, setPackageWeight] = useState(data.packageWeight ?? "");
  const [packageVisibleWeight, setPackageVisibleWeight] = useState(
    data.packageWeight ?? ""
  );
  const [packageContent, setPackageContent] = useState(
    data.packageContent ?? ""
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSelect = (value: string) => {
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
      case "packageDescription":
        setPackageContent(value);
        break;
    }

    setModalVisible(false);
    setActiveDropdown(null);
  };

  const handleNext = useCallback(() => {
    updateField("packageType", packageType);
    updateField("packageSize", packageSize);
    updateField("packageWeight", packageWeight);
    updateField("packageContent", packageContent);

    router.push("/multistep/step3");
  }, [packageType, packageSize, packageWeight, packageContent]);

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
      <Text className="mb-2 font-DMSansSemiBold">{label}</Text>
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
          <Text className="text-4xl font-HostGorteskBold">
            Provide Package Details
          </Text>
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
        </View>
      </ScrollView>
      <View>
        <CustomButton title="Next" onPress={handleNext} />
      </View>
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
              keyExtractor={(item) => item.id.toString()}
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
