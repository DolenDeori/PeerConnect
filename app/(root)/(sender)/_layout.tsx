import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="packageDetailForm" options={{ headerShown: false }} />
      <Stack.Screen name="packageSummery" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
