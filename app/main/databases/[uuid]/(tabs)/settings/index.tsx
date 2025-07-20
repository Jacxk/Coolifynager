import { ChevronRight } from "@/components/icons/ChevronRight";
import { TriangleAlert } from "@/components/icons/TriangleAlert";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

function SettingsLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href as any} className="py-4">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row items-center gap-3">
          {icon}
          <Text className="text-lg">{label}</Text>
        </View>
        <ChevronRight />
      </View>
    </Link>
  );
}

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
