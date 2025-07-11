import { UpdateApplicationBody } from "@/api/types/application.types";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import InfoDialog from "../InfoDialog";
import { useConfiguration } from "../providers/ConfigurationProvider";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { H3 } from "../ui/typography";

export default function DockerRegistrySection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();

  const setDockerRegistryImageName = (value: string) => {
    updateConfiguration({
      docker_registry_image_name: value,
    });
  };

  const setDockerRegistryImageTag = (value: string) => {
    updateConfiguration({
      docker_registry_image_tag: value,
    });
  };

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
        <Input
          placeholder="Enter Docker image name"
          value={configuration.docker_registry_image_name ?? ""}
          onChangeText={setDockerRegistryImageName}
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
        <Input
          placeholder="Enter Docker image tag (e.g. latest)"
          value={configuration.docker_registry_image_tag ?? ""}
          onChangeText={setDockerRegistryImageTag}
        />
      </View>
    </View>
  );
}
