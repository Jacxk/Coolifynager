import { Stack } from "expo-router";

export default function CreateResourceLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "New Resource" }} />
      <Stack.Screen
        name="application/git/public"
        options={{ title: "Public Repository" }}
      />
      <Stack.Screen
        name="application/git/private-app"
        options={{ title: "Private - GitHub App" }}
      />
      <Stack.Screen
        name="application/git/private-key"
        options={{ title: "Private - Deploy Key" }}
      />
    </Stack>
  );
}
