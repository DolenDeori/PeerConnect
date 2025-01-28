import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen 
        name="package-details" 
        options={{ 
          headerShown: true,
          title: "Package Details",
          // You can add more header options here if needed
        }} 
      />
    </Stack>
  );
};

export default Layout;