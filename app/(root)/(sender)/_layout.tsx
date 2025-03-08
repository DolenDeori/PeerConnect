import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="package-info-form" options={{ headerShown: false }} />
      <Stack.Screen name="package-summery" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
