import { Alert, Image, Text, View } from "react-native";
import CustomButton from "./customButton";
import { icons } from "@/constant";

const OAuth = () => {
  const handleGoogleSignIn = () => {
    Alert.alert("Google Sign-In", "This feature is under development.");
  };

  return (
    <View>
      {/* OR Separator */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500 font-DMSansRegular">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Google OAuth Button */}
      <CustomButton
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        bgVariant="outline-black"
        textVariant="default"
        IconLeft={() => (
          <Image
            source={icons.google_icon}
            resizeMode="contain"
            className="w-5 h-5 mx-4"
          />
        )}
      />
    </View>
  );
};
export default OAuth;
