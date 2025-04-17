import "react-native-gesture-handler";
import "react-native-get-random-values";
import "react-native-reanimated";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <Redirect href={"/(auth)/onboarding"} />;
}
