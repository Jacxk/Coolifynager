import { Stack } from "expo-router";

export default function DatabaseSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="danger" options={{ title: "" }} />
    </Stack>
  );
}
