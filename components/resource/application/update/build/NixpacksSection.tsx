import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { openBrowserAsync } from "expo-web-browser";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function NixpacksSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Install Command</Text>
          <InfoDialog
            title="Install Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="install_command"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { isDirty },
          }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Install Command"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Build Command</Text>
          <InfoDialog
            title="Build Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="build_command"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { isDirty },
          }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Build Command"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Start Command</Text>
          <InfoDialog
            title="Start Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="start_command"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { isDirty },
          }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Start Command"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <Text className="text-muted-foreground text-sm">
        Nixpacks will detect the required configuration automatically.{" "}
        <Text
          className="underline text-sm"
          onPress={() =>
            openBrowserAsync("https://coolify.io/docs/applications/")
          }
        >
          Framework Specific Docs
        </Text>
      </Text>
    </>
  );
}
