import { updateApplication } from "@/api/application";
import {
  BuildPack,
  RedirectType,
  SingleApplication,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";
import { toast } from "sonner-native";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import BuildSection from "./BuildSection";
import DockerRegistrySection from "./DockerRegistrySection";
import GeneralSection from "./GeneralSection";

const getInitialValues = (
  data: SingleApplication | undefined
): Partial<UpdateApplicationBody> => ({
  name: data?.name ?? "",
  description: data?.description ?? "",
  limits_cpu_shares: data?.limits_cpu_shares ?? 0,
  limits_cpus: data?.limits_cpus ?? "",
  limits_memory: data?.limits_memory ?? "",
  limits_memory_reservation: data?.limits_memory_reservation ?? "",
  limits_memory_swap: data?.limits_memory_swap ?? "",
  limits_memory_swappiness: data?.limits_memory_swappiness ?? 0,
  ports_mappings: data?.ports_mappings ?? "",
  build_pack: data?.build_pack ?? BuildPack.nixpacks,
  redirect: data?.redirect ?? RedirectType.both,
  domains: data?.fqdn ?? "",
  docker_registry_image_name: data?.docker_registry_image_name ?? "",
  docker_registry_image_tag: data?.docker_registry_image_tag ?? "",
  install_command: data?.install_command ?? "",
  build_command: data?.build_command ?? "",
  start_command: data?.start_command ?? "",
  base_directory: data?.base_directory ?? "",
  publish_directory: data?.publish_directory ?? "",
  docker_compose_location: data?.docker_compose_location ?? "",
  docker_compose_custom_build_command:
    data?.docker_compose_custom_build_command ?? "",
  docker_compose_custom_start_command:
    data?.docker_compose_custom_start_command ?? "",
  watch_paths: data?.watch_paths ?? "",
  custom_docker_run_options: data?.custom_docker_run_options ?? "",
  use_build_server: false,
});

export default function UpdateApplication({
  data,
  setIsEditing,
}: {
  data: SingleApplication | undefined;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const { mutateAsync: saveChanges } = useMutation(
    updateApplication(data?.uuid!)
  );

  const handleSave = (
    configuration: Partial<UpdateApplicationBody>,
    openSaveToast: () => void,
    closeSaveToast: (reset?: boolean) => void,
    updateInitialValues: (
      newInitialValues: Partial<UpdateApplicationBody>
    ) => void
  ) => {
    console.log("configuration.domains", configuration.domains);
    closeSaveToast(false);
    toast.promise(saveChanges(configuration), {
      loading: "Saving changes...",
      success: () => {
        // Update initial values with the saved configuration to prevent "dirty" state
        updateInitialValues(configuration);
        setIsEditing(false);
        return "Changes saved successfully!";
      },
      error: (err: unknown) => {
        console.log(err);
        openSaveToast();
        return (err as ResourceHttpError).message ?? "Failed to save changes.";
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <ConfigurationProvider
      initialValues={getInitialValues(data)}
      handleSave={handleSave}
      handleCancel={handleCancel}
      onToastOpen={() => {
        setIsEditing(true);
      }}
      onToastClose={() => {
        setIsEditing(false);
      }}
    >
      <View className="gap-10">
        <GeneralSection />
        <DockerRegistrySection />
        <BuildSection />
      </View>
    </ConfigurationProvider>
  );
}
