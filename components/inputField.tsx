import React from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  error,
  isPassword = false,
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {/* ----------- Label ---------------- */}
      {label && (
        <Text
          className={`text-sm font-DMSansMedium text-gray-700 mb-2 ${labelClassName}`}
        >
          {label}
        </Text>
      )}

      {/* ------------ Input ---------------- */}
      <View className="relative">
        <TextInput
          className={`py-4 px-4 border rounded-xl text-base bg-gray-100 font-DMSansRegular ${
            error ? "border-red-500" : "border-gray-300"
          } ${inputClassName}`}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {/* ------------------ Password Visibility Toggle -------------- */}
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ---------- Error Message ---------------------- */}
      {error && (
        <Text
          className={`text-sm text-red-500 mt-1 font-DMSansRegular ${errorClassName}`}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
