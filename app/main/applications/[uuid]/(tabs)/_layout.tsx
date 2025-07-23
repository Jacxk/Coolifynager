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
          tabBarIcon: (props) => <Home {...props} />,
        }}
      />
      <Tabs.Screen
        name="deployments"
        options={{
          title: "Deployments",
          tabBarIcon: (props) => <Rocket {...props} />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: (props) => <Logs {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props) => <Settings {...props} />,
        }}
      />
    </Tabs>
  );
}
