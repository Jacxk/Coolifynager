import { updateApplication } from "@/api/application";
import {
  Application,
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import { useEditing } from "@/context/EditingContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import BuildSection from "./BuildSection";
import DeploymentCommandsSection from "./DeploymentCommandsSection";
import DockerComposeSection from "./DockerComposeSection";
import DockerRegistrySection from "./DockerRegistrySection";
import GeneralSection from "./GeneralSection";
import HTTPBasicAuthSection from "./HTTPBasicAuthSection";
import NetworkSection from "./NetworkSection";

const getInitialValues = (data: Application): UpdateApplicationBody => ({
  ports_mappings: data.ports_mappings,
  build_pack: data.build_pack,
  static_image:
    data.static_image === "false" ? "nginx:alpine" : data.static_image,
  custom_nginx_configuration: data.custom_nginx_configuration,
  redirect: data.redirect,
  domains: data.fqdn?.split(",").join("\n"),
  install_command: data.install_command,
  build_command: data.build_command,
  start_command: data.start_command,
  base_directory: data.base_directory,
  publish_directory: data.publish_directory,
  docker_compose_location: data.docker_compose_location,
  docker_compose_custom_build_command: data.docker_compose_custom_build_command,
  docker_compose_custom_start_command: data.docker_compose_custom_start_command,
  watch_paths: data.watch_paths,
  custom_docker_run_options: data.custom_docker_run_options,
  use_build_server: data.destination.server.settings.is_build_server,
  ports_exposes: data.ports_exposes,
  custom_network_aliases: data.custom_network_aliases,
  is_http_basic_auth_enabled: data.is_http_basic_auth_enabled,
  http_basic_auth_username: data.http_basic_auth_username,
  http_basic_auth_password: data.http_basic_auth_password,
  custom_labels: data.custom_labels,
  pre_deployment_command: data.pre_deployment_command,
  post_deployment_command: data.post_deployment_command,
});

export default function UpdateApplication({ data }: { data: Application }) {
  const { setIsEditing } = useEditing();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateApplicationBody>({
    values: getInitialValues(data),
  });
  const [readonlyLabels, setReadonlyLabels] = useState(true);

  const { mutateAsync: saveChanges } = useMutation(
    updateApplication(data.uuid)
  );

  const handleSave = (data: UpdateApplicationBody) => {
    toast.promise(
      saveChanges({
        ...data,
        domains: data.domains?.split("\n").join(","),
        custom_nginx_configuration:
          data.build_pack === BuildPack.static
            ? Buffer.from(data.custom_nginx_configuration ?? "").toString(
                "base64"
              )
            : undefined,
      }),
      {
        loading: "Saving changes...",
        success: () => {
          reset((data) => data, {
            keepDirtyValues: true,
          });
          setIsEditing(false);
          return "Changes saved successfully!";
        },
        error: (err: unknown) => {
          console.log(err);
          return (
            (err as ResourceHttpError).message ?? "Failed to save changes."
          );
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: Fix if labels are set and not readonly, then user cancels an edit.
    setReadonlyLabels(true);
    reset();
  };

  useUnsavedChanges({
    isDirty: Object.keys(dirtyFields).length > 0,
    onSave: handleSubmit(handleSave),
    onCancel: handleCancel,
    onOpen: () => setIsEditing(true),
    onClose: () => setIsEditing(false),
    onLostFocus: () => setIsEditing(false),
    onFocus: reset,
  });

  return (
    <View className="gap-10">
      <GeneralSection
        control={control}
        errors={errors}
        readonlyLabels={readonlyLabels}
      />
      <DockerRegistrySection control={control} />
      <BuildSection control={control} />
      <NetworkSection control={control} />
      <HTTPBasicAuthSection
        control={control}
        errors={errors}
        readonlyLabels={readonlyLabels}
        setReadonlyLabels={setReadonlyLabels}
      />
      <DockerComposeSection
        control={control}
        dockerComposeRaw={data.docker_compose_raw ?? ""}
        dockerCompose={data.docker_compose ?? ""}
      />
      <DeploymentCommandsSection control={control} />
    </View>
  );
}
