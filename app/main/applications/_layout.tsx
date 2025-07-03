import { Stack } from "expo-router";

export default function ApplicationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[uuid]/index" />
      <Stack.Screen name="[uuid]/logs" />
    </Stack>
  );
}
