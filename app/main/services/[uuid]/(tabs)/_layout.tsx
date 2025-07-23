import { Tabs } from "expo-router";
import { Home, Logs, Settings } from "lucide-react-native";

export default function ServiceTabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (props) => <Home {...props} />,
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
