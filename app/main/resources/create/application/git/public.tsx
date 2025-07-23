import { createApplication } from "@/api/application";
import {
  BuildPack,
  CoolifyApplications,
  CreateApplicationBodyGit,
} from "@/api/types/application.types";
import { BuildPackSelect } from "@/components/resource/application/update/GeneralSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";

// TODO: Implement server and environment selection
export default function CreatePublicRepositoryApplication() {
  const { environment_uuid, server_uuid, project_uuid } = useLocalSearchParams<{
    environment_uuid: string;
    server_uuid: string;
    project_uuid: string;
  }>();
  const headerHeight = useHeaderHeight();

  const { control, handleSubmit } = useForm({
    values: {
      git_branch: "main",
      git_repository: "",
      ports_exposes: "80",
      build_pack: BuildPack.nixpacks,
      environment_uuid,
      server_uuid,
      project_uuid,
    },
  });

  const { mutateAsync, isPending } = useMutation(
    createApplication<
      CoolifyApplications.PUBLIC_REPOSITORY,
      CreateApplicationBodyGit
    >()
  );

  const handleCreateApplication = (data: CreateApplicationBodyGit) => {
    toast.promise(
      mutateAsync({
        body: data,
        type: CoolifyApplications.PUBLIC_REPOSITORY,
      }),
      {
        loading: "Creating application...",
        success: (data) => {
          router.dismissTo({
            pathname: "/main/applications/[uuid]/(tabs)",
            params: {
              uuid: data.uuid,
            },
          });
          return "Application created successfully";
        },
        error: () => {
          return "Failed to create application";
        },
      }
    );
  };

  // TODO: Reflect Coolify UI
  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="gap-4 flex-1 justify-center"
      style={{ marginTop: -headerHeight }}
    >
      <Controller
        control={control}
        name="git_repository"
        rules={{
          required: "Repository URL is required",
          pattern: {
            value:
              /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            message: "Invalid repository URL",
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <Text>Repository URL</Text>
            <Input onChangeText={onChange} onBlur={onBlur} value={value} />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="git_branch"
        rules={{ required: "Branch is required" }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <Text>Branch</Text>
            <Input onChangeText={onChange} onBlur={onBlur} value={value} />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="build_pack"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text>Build Pack</Text>
            <BuildPackSelect
              value={value ?? BuildPack.nixpacks}
              onChange={onChange}
            />
          </View>
        )}
      />

      {/* TODO: Implement ports exposes from update application */}
      <Controller
        control={control}
        name="ports_exposes"
        rules={{
          required: "Ports Exposes is required",
          pattern: {
            value: /^(\d+)(,\d+)*$/,
            message:
              "Invalid ports exposes. Use comma separated numbers (e.g. 80,443)",
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <Text>Ports Exposes</Text>
            <Input onChangeText={onChange} onBlur={onBlur} value={value} />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />

      <Button
        onPress={handleSubmit(handleCreateApplication)}
        loading={isPending}
      >
        <Text>Create</Text>
      </Button>
    </ScrollView>
  );
}
