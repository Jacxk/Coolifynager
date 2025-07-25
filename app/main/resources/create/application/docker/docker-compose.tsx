import {
  CoolifyApplications,
  CreateApplicationBodyDockerCompose,
} from "@/api/types/application.types";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { Buffer } from "buffer";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DockerFile() {
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateApplicationBodyDockerCompose>({
    defaultValues: {
      docker_compose_raw: "",
    },
  });

  const { handleCreateApplication, isPending } =
    useCreateApplication<CreateApplicationBodyDockerCompose>(
      CoolifyApplications.DOCKER_COMPOSE_EMPTY,
      "services"
    );

  const handleCreate = (data: CreateApplicationBodyDockerCompose) => {
    handleCreateApplication({
      docker_compose_raw: Buffer.from(data.docker_compose_raw).toString(
        "base64"
      ),
    });
  };

  return (
    <ScrollView
      className="p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      contentContainerClassName="gap-4 flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <Controller
        control={control}
        name="docker_compose_raw"
        rules={{
          required: "Docker Compose is required",
        }}
        render={({ field: { onChange, value } }) => (
          <View className="gap-1 flex-1">
            <Text className="text-muted-foreground">
              Docker Compose Contents
            </Text>
            <Textarea
              placeholder={`version: "3.8"\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - "80:80"`}
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoComplete="off"
              className="flex-1"
              numberOfLines={value.split("\n").length + 3}
            />
          </View>
        )}
      />

      <Button
        onPress={handleSubmit(handleCreate)}
        loading={isPending}
        disabled={!isValid}
      >
        <Text>Create</Text>
      </Button>
    </ScrollView>
  );
}
