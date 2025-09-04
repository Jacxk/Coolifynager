import { Pressable, View } from "react-native";
import { Text } from "./ui/text";

export type SettingsButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  rightComponent?: React.ReactNode;
  description?: string;
};

export function SettingsButton({
  onPress,
  label,
  icon,
  rightComponent,
  description,
}: SettingsButtonProps) {
  return (
    <View className="py-4">
      {description && (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      )}
      <Pressable onPress={onPress}>
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-3">
            {icon}
            <Text className="text-lg">{label}</Text>
          </View>
          {rightComponent}
        </View>
      </Pressable>
    </View>
  );
}
