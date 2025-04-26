import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(sender)" options={{ headerShown: false }} />
      <Stack.Screen name="(traveler)" options={{ headerShown: false }} />
      <Stack.Screen name="(kyc)" options={{ headerShown: false }} />
      <Stack.Screen name="track-package" options={{ headerShown: false }} />
      <Stack.Screen name="receive-package" options={{ headerShown: false }} />
      <Stack.Screen name="account-settings" options={{ headerShown: false }} />
      <Stack.Screen name="track-deliveries" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
