import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="package-details" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="package-summery" 
        options={{ 
          headerShown: false,
        }} 
      />
    {/* </Stack> */}
    </Stack>
  );
};
export default Layout;
