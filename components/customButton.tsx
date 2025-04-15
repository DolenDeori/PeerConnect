import { ButtonProps } from "@/types/type";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-white border border-1";
    case "outline-black":
      return "bg-transparent border-black border border-1";
    default:
      return "bg-blue-500";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-white";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-black";
  }
};

const CustomButton = ({
  title,
  onPress,
  bgVariant = "primary",
  textVariant = "primary",
  loading = false,
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`min-w-11/12 rounded-xl flex flex-row justify-center items-center p-3 ${getBgVariantStyle(
      bgVariant
    )} ${className}`}
    {...props}
  >
    {IconLeft && <IconLeft />}
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text
        className={`text-lg font-HostGorteskBold ${getTextVariantStyle(
          textVariant
        )}`}
      >
        {title}
      </Text>
    )}
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CustomButton;
