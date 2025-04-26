import React, { useState } from "react";
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
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <Text
          className={`text-sm font-DMSansMedium ${
            error ? "text-red-600" : "text-gray-800"
          } mb-2 ${labelClassName}`}
        >
          {label}
        </Text>
      )}

      {/* Input */}
      <View className="relative">
        <TextInput
          className={`px-4 py-4 border rounded-lg text-base bg-gray-50 font-DMSansRegular ${
            error ? "border-red-600" : "border-gray-300"
          } ${inputClassName} focus:border-purple-300`}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {/* Password Visibility Toggle */}
        {isPassword && (
          <TouchableOpacity
            className="absolute right-3 top-3"
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

      {/* Error Message */}
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
