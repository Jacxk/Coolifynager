import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function ErrorLayout() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

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
