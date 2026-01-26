import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { openBrowserAsync } from "expo-web-browser";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function DockerRegistrySection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-2">
      <InfoDialog
        label={<H3>Docker Registry</H3>}
        description={
          <Text className="text-muted-foreground">
            Push the built image to a docker registry. More info{" "}
            <Text
              className="underline"
              onPress={() =>
                openBrowserAsync(
                  "https://coolify.io/docs/knowledge-base/docker/registry",
                )
              }
            >
              here
            </Text>
            .
          </Text>
        }
      />
      <View className="gap-1">
        <InfoDialog
          label="Docker Image"
          description={
            <Text className="text-muted-foreground">
              Empty means it won't push the image to a docker registry.
            </Text>
          }
        />
        <Controller
          control={control}
          name="docker_registry_image_name"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { isDirty },
          }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Docker image name"
              autoCapitalize="none"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <InfoDialog
          label="Docker Image Tag"
          description={
            <View className="gap-4">
              <Text className="text-muted-foreground">
                If set, it will tag the built image with this tag too.
              </Text>
              <Text className="text-muted-foreground">
                Example: If you set it to 'latest', it will push the image with
                the commit sha tag + with the latest tag.
              </Text>
            </View>
          }
        />
        <Controller
          control={control}
          name="docker_registry_image_tag"
          render={({
            field: { onChange, value, onBlur },
            fieldState: { isDirty },
          }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Docker image tag (e.g. latest)"
              autoCapitalize="none"
            />
          )}
        />
      </View>
    </View>
  );
}
