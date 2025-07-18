import { Tabs, useLocalSearchParams } from "expo-router";
import { Home, Logs, Rocket, Settings } from "lucide-react-native";

export default function ApplicationTabLayout() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: uuid === "never" ? { display: "none" } : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deployments"
        options={{
          title: "Deployments",
          tabBarIcon: ({ color }) => <Rocket size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: ({ color }) => <Logs size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
