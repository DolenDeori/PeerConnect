import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="kyc-form" options={{ headerShown: false }} />
      <Stack.Screen name="(multistep)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
