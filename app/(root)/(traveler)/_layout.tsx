import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="traveler-info-form"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
