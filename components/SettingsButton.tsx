import { cn } from "@/lib/utils";
import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

export type SettingsButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  rightComponent?: React.ReactNode;
  description?: string;
  labelClassName?: string;
  pressable?: boolean;
};

export function SettingsButton({
  onPress,
  label,
  icon,
  rightComponent,
  description,
  labelClassName,
  pressable = true,
}: SettingsButtonProps) {
  return (
    <View className="py-4">
      {description && (
        <Text className="text-sm text-muted-foreground mb-1">
          {description}
        </Text>
      )}
      <TouchableOpacity onPress={onPress} disabled={!pressable}>
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-3">
            {icon}
            <Text className={cn("text-lg", labelClassName)}>{label}</Text>
          </View>
          {rightComponent}
        </View>
      </TouchableOpacity>
    </View>
  );
}
