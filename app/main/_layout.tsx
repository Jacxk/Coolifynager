import { AddResourceButton } from "@/components/AddResourceButton";
import { SettingsIcon } from "@/components/icons/Settings";
import { APP_NAME } from "@/constants/AppDetails";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="applications/index"
        options={{ title: "Applications", headerShown: true }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: APP_NAME,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/main/settings")}>
              <SettingsIcon />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: "Settings", headerShown: true }}
      />
      <Stack.Screen
        name="projects/index"
        options={{
          title: "Projects",
          headerShown: true,
          headerRight: () => <AddResourceButton href="/main/projects/create" />,
        }}
      />
      <Stack.Screen
        name="projects/[uuid]"
        options={({ route }) => {
          const routeParams = route.params as {
            environments: string[];
            name: string;
            uuid: string;
          };
          return {
            title: routeParams.name,
            headerShown: true,
            headerRight: () => (
              <AddResourceButton
                href={{
                  pathname: "/main/resources/create",
                  params: {
                    environments: routeParams.environments,
                    project_uuid: routeParams.uuid,
                  },
                }}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="projects/create"
        options={{ title: "New Project", headerShown: true }}
      />
      <Stack.Screen
        name="servers/index"
        options={{ title: "Servers", headerShown: true }}
      />
      <Stack.Screen
        name="databases/index"
        options={{ title: "Databases", headerShown: true }}
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
