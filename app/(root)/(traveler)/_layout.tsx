import React from "react";
import { Stack } from "expo-router";

export default function TravellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <Stack.Screen name="traveller-journey" options={{ headerShown: false }} />
      <Stack.Screen name="traveler" options={{ headerShown: false }} />
      <Stack.Screen name="step1" options={{ headerShown: false }} />
      <Stack.Screen name="step2" options={{ headerShown: false }} />
      <Stack.Screen name="step3" options={{ headerShown: false }} />
      <Stack.Screen name="kyc" options={{ headerShown: false }} />
    </Stack>
  );
}
