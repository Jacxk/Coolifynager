import { SplashScreen, Stack } from "expo-router";

export default function ErrorLayout() {
  SplashScreen.hide();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "fullScreenModal",
      }}
    >
      <Stack.Screen
        name="server_unreachable"
        options={{ title: "Server Unreachable" }}
      />
    </Stack>
  );
}
