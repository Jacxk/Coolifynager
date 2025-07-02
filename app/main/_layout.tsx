import { APP_NAME } from "@/constants/AppDetails";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={({ route }) => {
        const params = route.params as any;
        if (route.name === "index") {
          return {
            headerShown: true,
            title: APP_NAME,
          };
        }
        return {
          headerShown: true,
          title: params?.name ?? "",
        };
      }}
    />
  );
}
