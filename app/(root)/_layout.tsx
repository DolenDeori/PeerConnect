import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="package-details" 
        options={{ 
          headerShown: false,
          // title: "Package Details",
          // You can add more header options here if needed
        }} 
      />
    {/* </Stack> */}
    </Stack>
  );
};
export default Layout;
