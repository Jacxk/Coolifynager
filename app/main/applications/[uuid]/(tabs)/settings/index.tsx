import { useApplicationEnvs } from "@/api/application";
import { Code } from "@/components/icons/Code";
import { TriangleAlert } from "@/components/icons/TriangleAlert";
import { SettingsLink } from "@/components/SettingsLink";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalSearchParams } from "expo-router";
import { FlatList } from "react-native";

export default function ApplicationSettingsIndex() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  useApplicationEnvs(uuid, { enabled: isFocused });

  const data = [
    {
      icon: <Code />,
      href: "./settings/environments",
      label: "Environment Variables",
    },
    {
      icon: <TriangleAlert />,
      href: "./settings/danger",
      label: "Danger Zone",
    },
  ];

  return (
    <FlatList
      className="p-4"
      data={data}
      renderItem={({ item }) => (
        <SettingsLink icon={item.icon} href={item.href} label={item.label} />
      )}
    />
  );
}
