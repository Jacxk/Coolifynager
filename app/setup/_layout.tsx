import { Stack } from "expo-router";

export default function SetupLayout() {
  return (
    <Stack
      initialRouteName="serverAddress"
      screenOptions={{ headerShown: false }}
    />
  );
}
