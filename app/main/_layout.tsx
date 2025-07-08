import { APP_NAME } from "@/constants/AppDetails";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={({ route }) => {
        if (route.name === "index") {
          return {
            headerShown: true,
            title: APP_NAME,
          };
        }

        const header = {
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        };

        if (route.name === "applications") {
          return {
            ...header,
            title: "Applications",
          };
        }

        if (route.name === "projects/index") {
          return {
            ...header,
            title: "Projects",
          };
        }

        if (route.name === "projects/[uuid]" && route.params?.name) {
          return {
            headerShown: true,
            headerBackButtonDisplayMode: "default",
            title: route.params.name,
          };
        }

        if (route.name === "servers/index") {
          return {
            ...header,
            title: "Servers",
          };
        }

        if (route.name === "teams/index") {
          return {
            ...header,
            title: "Teams",
          };
        }

        return {
          headerShown: false,
        };
      }}
    />
  );
}
