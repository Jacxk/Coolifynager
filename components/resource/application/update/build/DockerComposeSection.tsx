import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function DockerComposeSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <>
      <View className="gap-1">
        <InfoDialog
          label="Docker Compose Location"
          description={
            <Text className="text-muted-foreground">
              It is calculated together with the Base Directory:{" "}
              <Text className="text-yellow-500">/docker-compose.yaml</Text>
            </Text>
          }
        />
        <Controller
          control={control}
          name="docker_compose_location"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="/docker-compose.yaml"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <Text className="text-muted-foreground mt-6">
        The following commands are for advanced use cases. Only modify them if
        you know what are you doing.
      </Text>
      <View className="gap-1">
        <InfoDialog
          label="Custom Build Command"
          description={
            <View className="gap-4">
              <Text className="text-muted-foreground">
                If you use this, you need to specify paths relatively and should
                use the same compose file in the custom command, otherwise the
                automatically configured labels / etc won't work.
              </Text>
              <Text className="text-muted-foreground">
                So in your case, use:{" "}
                <Text className="text-yellow-500">
                  docker compose -f ./docker-compose.yaml build
                </Text>
              </Text>
            </View>
          }
        />
        <Controller
          control={control}
          name="docker_compose_custom_build_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="docker compose build"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <InfoDialog
          label="Custom Start Command"
          description={
            <View className="gap-4">
              <Text className="text-muted-foreground">
                If you use this, you need to specify paths relatively and should
                use the same compose file in the custom command, otherwise the
                automatically configured labels / etc won't work.
              </Text>
              <Text className="text-muted-foreground">
                So in your case, use:{" "}
                <Text className="text-yellow-500">
                  docker compose -f ./docker-compose.yaml up -d
                </Text>
              </Text>
            </View>
          }
        />
        <Controller
          control={control}
          name="docker_compose_custom_start_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="docker compose up -d"
              autoCapitalize="none"
            />
          )}
        />
      </View>
    </>
  );
}
