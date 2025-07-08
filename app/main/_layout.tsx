import { APP_NAME } from "@/constants/AppDetails";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: APP_NAME, headerShown: true }}
      />
      <Stack.Screen
        name="projects/index"
        options={{ title: "Projects", headerShown: true }}
      />
      <Stack.Screen
        name="projects/[uuid]"
        options={({ route }) => ({
          title: route.params?.name,
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="servers/index"
        options={{ title: "Servers", headerShown: true }}
      />
      <Stack.Screen
        name="services/index"
        options={{ title: "Services", headerShown: true }}
      />
      <Stack.Screen
        name="teams/index"
        options={{ title: "Teams", headerShown: true }}
      />
    </Stack>
  );
}
