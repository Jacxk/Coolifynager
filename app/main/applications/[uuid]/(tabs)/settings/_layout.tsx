import { Plus } from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";
import { router, Stack } from "expo-router";

export default function ApplicationSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen
        name="environments/index"
        options={{
          title: "Environment Variables",
          headerRight: () => (
            <Button
              size="icon"
              variant="ghost"
              onPress={() => router.push("./environments/create")}
            >
              <Plus />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="environments/create"
        options={{ title: "New Environment Variable" }}
      />
      <Stack.Screen name="danger" options={{ title: "" }} />
    </Stack>
  );
}
