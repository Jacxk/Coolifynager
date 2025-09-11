import { Stack } from "expo-router";

export default function SetupLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
  );
}
