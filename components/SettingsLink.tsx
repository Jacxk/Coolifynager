import { Link } from "expo-router";
import { View } from "react-native";
import { ChevronRight } from "./icons/ChevronRight";
import { Text } from "./ui/text";

export type SettingsLinkProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

export function SettingsLink({
  href,
  label,
  icon,
  description,
}: SettingsLinkProps) {
  return (
    <View className="py-4">
      {description && (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      )}
      <Link href={href as any}>
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-3">
            {icon}
            <Text className="text-lg">{label}</Text>
          </View>
          <ChevronRight />
        </View>
      </Link>
    </View>
  );
}
