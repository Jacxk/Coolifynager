import {
  CoolifyApplications,
  CreateApplicationBodyDockerfile,
} from "@/api/types/application.types";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { Buffer } from "buffer";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DockerFile() {
  const insets = useSafeAreaInsets();
  const { environment_uuid, server_uuid, project_uuid } = useLocalSearchParams<{
    environment_uuid: string;
    server_uuid: string;
    project_uuid: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateApplicationBodyDockerfile>({
    defaultValues: {
      dockerfile: "",
    },
  });

  const { handleCreateApplication, isPending } =
    useCreateApplication<CreateApplicationBodyDockerfile>(
      CoolifyApplications.DOCKERFILE,
      {
        environment_uuid,
        server_uuid,
        project_uuid,
      }
    );

  const handleCreate = (data: CreateApplicationBodyDockerfile) => {
    handleCreateApplication({
      dockerfile: Buffer.from(data.dockerfile).toString("base64"),
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
        name="dockerfile"
        rules={{
          required: "Dockerfile is required",
        }}
        render={({ field: { onChange, value } }) => (
          <View className="gap-1 flex-1">
            <Text className="text-muted-foreground">Dockerfile Contents</Text>
            <Textarea
              placeholder={`FROM nginx\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`}
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
