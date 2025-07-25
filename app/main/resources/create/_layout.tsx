import { Stack } from "expo-router";

export default function CreateResourceLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "New Resource" }} />
      <Stack.Screen
        name="application/git/index"
        options={{ title: "New Application - Git" }}
      />
      <Stack.Screen
        name="application/git/private-app"
        options={{ title: "Private - GitHub App" }}
      />
      <Stack.Screen
        name="application/docker/docker-image"
        options={{ title: "New Application - Docker Image" }}
      />
      <Stack.Screen
        name="application/docker/docker-file"
        options={{ title: "New Application - Dockerfile" }}
      />
    </Stack>
  );
}
