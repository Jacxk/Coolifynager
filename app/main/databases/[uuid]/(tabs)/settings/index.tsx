import { TriangleAlert } from "@/components/icons/TriangleAlert";
import { SettingsLink } from "@/components/SettingsLink";
import { FlatList } from "react-native";

export default function DatabaseSettingsIndex() {
  const data = [
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
