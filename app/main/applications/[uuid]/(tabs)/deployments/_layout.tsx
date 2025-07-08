import { Stack } from "expo-router";

export default function ApplicationSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Deployments" }} />
      <Stack.Screen name="logs" options={{ title: "Deployment Logs" }} />
    </Stack>
  );
}
