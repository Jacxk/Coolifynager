import { UpdateApplicationBody } from "@/api/types/application.types";
import { openBrowserAsync } from "expo-web-browser";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import InfoDialog from "../../../InfoDialog";
import { Input } from "../../../ui/input";
import { Text } from "../../../ui/text";
import { H3 } from "../../../ui/typography";

export default function DockerRegistrySection({
  control,
  errors,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
  errors: FieldErrors<Partial<UpdateApplicationBody>>;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1">
        <H3>Docker Registry</H3>
        <InfoDialog
          title="Docker Registry"
          description={
            <Text className="text-muted-foreground">
              Push the built image to a docker registry. More info{" "}
              <Text
                className="underline"
                onPress={() =>
                  openBrowserAsync(
                    "https://coolify.io/docs/knowledge-base/docker/registry"
                  )
                }
              >
                here
              </Text>
              .
            </Text>
          }
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Docker Image</Text>
          <InfoDialog
            title="Docker Image"
            description={
              <Text className="text-muted-foreground">
                Empty means it won't push the image to a docker registry.
              </Text>
            }
          />
        </View>
        <Controller
          control={control}
          name="docker_registry_image_name"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Docker image name"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Docker Image Tag</Text>
          <InfoDialog
            title="Docker Image Tag"
            description={
              <View className="gap-4">
                <Text className="text-muted-foreground">
                  If set, it will tag the built image with this tag too.
                </Text>
                <Text className="text-muted-foreground">
                  Example: If you set it to 'latest', it will push the image
                  with the commit sha tag + with the latest tag.
                </Text>
              </View>
            }
          />
        </View>
        <Controller
          control={control}
          name="docker_registry_image_tag"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Docker image tag (e.g. latest)"
            />
          )}
        />
      </View>
    </View>
  );
}
