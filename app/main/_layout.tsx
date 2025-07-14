import { Plus } from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/AppDetails";
import { router, Stack } from "expo-router";

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
              <Button
                variant="ghost"
                size="icon"
                onPress={() =>
                  router.push({
                    pathname: "/main/resources/create",
                    params: {
                      environments: routeParams.environments,
                      project_uuid: routeParams.uuid,
                    },
                  })
                }
              >
                <Plus />
              </Button>
            ),
          };
        }}
      />
      <Stack.Screen
        name="resources/create"
        options={{ title: "New Resource", headerShown: true }}
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
