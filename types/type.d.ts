import React from "react";
import { TouchableOpacityProps, TextInputProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "success"
    | "outline-black";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

declare interface GoogleInputProps {
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
  }: // address,
  {
    latitude: number;
    longitude: number;
    // address: string;
  }) => void;
}
