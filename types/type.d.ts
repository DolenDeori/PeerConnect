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
  loading?: boolean;
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

export interface LocationFromGoogle {
  latitude: number;
  longitude: number;
  address: string;
}

export interface GoogleInputProps {
  initialLocation?: string;
  containerStyle?: string;
  placeholder?: string;
  textInputBackgroundColor?: string;
  handlePress: (
    location: LocationFromGoogle,
    details: GooglePlaceDetail | null
  ) => void;
}
