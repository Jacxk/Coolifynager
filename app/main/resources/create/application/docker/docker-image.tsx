import {
  CoolifyApplications,
  CreateApplicationBodyDockerImage,
} from "@/api/types/application.types";
import { PortsExposesController } from "@/components/resource/application/update/NetworkSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function DockerImage() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateApplicationBodyDockerImage>({
    defaultValues: {
      docker_registry_image_name: "",
      docker_registry_image_tag: "",
      ports_exposes: "80",
    },
  });

  const { handleCreateApplication, isPending } = useCreateApplication(
    CoolifyApplications.DOCKER_IMAGE
  );

  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="gap-4 flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <Controller
        control={control}
        name="docker_registry_image_name"
        rules={{
          required: "Docker registry image name is required",
        }}
        render={({ field: { onChange, value } }) => (
          <View className="gap-1">
            <Text className="text-muted-foreground">
              Docker Registry Image Name
            </Text>
            <Input
              placeholder="nginx"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoComplete="off"
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="docker_registry_image_tag"
        rules={{
          required: "Docker registry image tag is required",
        }}
        render={({ field: { onChange, value } }) => (
          <View className="gap-1">
            <Text className="text-muted-foreground">
              Docker Registry Image Tag
            </Text>
            <Input
              placeholder="latest"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoComplete="off"
            />
          </View>
        )}
      />

      <PortsExposesController control={control} />

      <Button
        onPress={handleSubmit(handleCreateApplication)}
        loading={isPending}
        disabled={!isValid}
      >
        <Text>Create</Text>
      </Button>
    </ScrollView>
  );
}
