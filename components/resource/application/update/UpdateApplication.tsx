import { updateApplication } from "@/api/application";
import {
  SingleApplication,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import BuildSection from "./BuildSection";
import DockerRegistrySection from "./DockerRegistrySection";
import GeneralSection from "./GeneralSection";

const getInitialValues = (
  data: SingleApplication
): Partial<UpdateApplicationBody> => ({
  name: data.name,
  description: data.description,
  limits_cpu_shares: data.limits_cpu_shares,
  limits_cpus: data.limits_cpus,
  limits_memory: data.limits_memory,
  limits_memory_reservation: data.limits_memory_reservation,
  limits_memory_swap: data.limits_memory_swap,
  limits_memory_swappiness: data.limits_memory_swappiness,
  ports_mappings: data.ports_mappings,
  build_pack: data.build_pack,
  redirect: data.redirect,
  domains: data.fqdn.split(",").join("\n"),
  docker_registry_image_name: data.docker_registry_image_name,
  docker_registry_image_tag: data.docker_registry_image_tag,
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
  use_build_server: false,
});

export default function UpdateApplication({
  data,
  setIsEditing,
}: {
  data: SingleApplication;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Partial<UpdateApplicationBody>>({
    values: getInitialValues(data),
  });
  const { mutateAsync: saveChanges } = useMutation(
    updateApplication(data.uuid)
  );

  const toastId = useRef<string | number | undefined>(undefined);

  const handleSave = (data: Partial<UpdateApplicationBody>) => {
    toast.promise(
      saveChanges({ ...data, domains: data.domains?.split("\n").join(",") }),
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
    reset();
  };

  useEffect(() => {
    if (isDirty && !toastId.current) {
      const newToastId = toast("You have unsaved changes", {
        dismissible: false,
        description: "Save your changes or cancel to discard them.",
        duration: Infinity,
        action: {
          label: "Save",
          onClick: handleSubmit(handleSave),
        },
        cancel: {
          label: "Cancel",
          onClick: () => {
            handleCancel();
          },
        },
      });
      toastId.current = newToastId;
      setIsEditing(true);
    } else if (!isDirty && toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = undefined;
      setIsEditing(false);
    }
  }, [isDirty]);

  useFocusEffect(
    useCallback(() => {
      setIsEditing(false);
      return () => {
        if (toastId.current) toast.dismiss(toastId.current);
        toastId.current = undefined;
      };
    }, [])
  );

  return (
    <View className="gap-10">
      <GeneralSection control={control} errors={errors} />
      <DockerRegistrySection control={control} errors={errors} />
      <BuildSection control={control} errors={errors} />
    </View>
  );
}
