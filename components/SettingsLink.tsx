import { cn } from "@/lib/utils";
import { Href, router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ChevronRight } from "./icons/ChevronRight";
import { Text } from "./ui/text";

export type SettingsLinkProps = {
  href: Href;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  labelClassName?: string;
};

export function SettingsLink({
  href,
  label,
  icon,
  description,
  labelClassName,
}: SettingsLinkProps) {
  return (
    <View className="py-4">
      {description && (
        <Text className="text-sm text-muted-foreground mb-1">
          {description}
        </Text>
      )}
      <TouchableOpacity onPress={() => router.push(href as any)}>
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-3">
            {icon}
            <Text className={cn("text-lg", labelClassName)}>{label}</Text>
          </View>
          <ChevronRight />
        </View>
      </TouchableOpacity>
    </View>
  );
}
