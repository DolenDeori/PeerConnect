import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import InputField from "@/components/inputField"; // Import your InputField component

interface CustomInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value = "",
  onChangeText = () => {},
  onPress = () => {},
}) => {
  return (
    <View className="mb-4">
      <Text className="text-lg mb-2">{label}</Text>

      {/* Use InputField for standard text input */}
      <InputField
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />

      {/* Touchable opacity for dropdown-style input */}
      <TouchableOpacity
        onPress={onPress}
        className="bg-gray-200 rounded-lg p-4 flex-row justify-between items-center mt-2"
      >
        <Text className="text-gray-600 text-lg">{placeholder}</Text>
        <ChevronDownIcon size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomInput;
