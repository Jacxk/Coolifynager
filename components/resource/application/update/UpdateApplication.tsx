import { useUpdateApplication } from "@/api/application";
import {
  Application,
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import { useEditing } from "@/context/EditingContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { getDirtyData } from "@/lib/utils";
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

export default function UpdateApplication({ data }: { data: Application }) {
  const { setIsEditing } = useEditing();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateApplicationBody>({
    shouldUnregister: true,
    values: {
      ...data,
      static_image:
        data.static_image === "false" ? "nginx:alpine" : data.static_image,
      domains: data.fqdn?.split(",").join("\n"),
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  const [readonlyLabels, setReadonlyLabels] = useState(true);

  const { mutateAsync: saveChanges } = useUpdateApplication(data.uuid);

  const applicationType = (() => {
    if (
      data.destination_type === "App\\Models\\StandaloneDocker" &&
      data.build_pack === BuildPack.dockerfile
    ) {
      return "Dockerfile";
    }
    return "Standalone";
  })();

  const handleSave = (data: UpdateApplicationBody) => {
    const changedData = getDirtyData(data, dirtyFields);
    if ("domains" in changedData) {
      changedData.domains = changedData.domains?.split("\n").join(",");
    }
    if ("custom_nginx_configuration" in changedData) {
      changedData.custom_nginx_configuration = Buffer.from(
        changedData.custom_nginx_configuration ?? ""
      ).toString("base64");
    }

    toast.promise(saveChanges(changedData), {
      loading: "Saving changes...",
      success: () => {
        reset();
        setIsEditing(false);
        return "Changes saved successfully!";
      },
      error: (err: unknown) => {
        console.log(err);
        return (err as ResourceHttpError).message ?? "Failed to save changes.";
      },
    });
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
        applicationType={applicationType}
      />
      <DockerRegistrySection control={control} />
      <BuildSection control={control} applicationType={applicationType} />
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
