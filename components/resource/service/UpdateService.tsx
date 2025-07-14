import { updateService } from "@/api/services";
import { ResourceHttpError } from "@/api/types/resources.types";
import { SingleService, UpdateServiceBody } from "@/api/types/services.types";
import InfoDialog from "@/components/InfoDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useMutation } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";

const getInitialValues = (data: SingleService): UpdateServiceBody => ({
  name: data.name,
  description: data.description,
  connect_to_docker_network: data.connect_to_docker_network,
  docker_compose_raw: data.docker_compose_raw,
  docker_compose: data.docker_compose,
  project_uuid: "",
  server_uuid: data.server.uuid,
});

export default function UpdateService({
  data,
  setIsEditing,
}: {
  data: SingleService;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateServiceBody>({
    values: getInitialValues(data),
  });
  const [showDeployableCompose, setShowDeployableCompose] = useState(false);
  const { mutateAsync: saveChanges } = useMutation(updateService(data.uuid));

  const handleSave = (data: UpdateServiceBody) => {
    toast.promise(saveChanges(data), {
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
        return (err as ResourceHttpError).message ?? "Failed to save changes.";
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  useUnsavedChanges({
    isDirty,
    onSave: handleSubmit(handleSave),
    onCancel: handleCancel,
    onOpen: () => setIsEditing(true),
    onClose: () => setIsEditing(false),
    onLostFocus: () => setIsEditing(false),
    onFocus: reset,
  });

  return (
    <View className="flex-1 gap-2">
      <InfoDialog
        label={<H3>Service Stack</H3>}
        title="Service Stack"
        description="All the fields are read-only. To update the service stack, please use the Coolify UI."
      />
      <View className="flex-row items-center gap-4">
        <InfoDialog
          label="Connect To Predefined Network"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                By default, you do not reach the Coolify defined networks.
                Starting a docker compose based resource will have an internal
                network. If you connect to a Coolify defined network, you maybe
                need to use different internal DNS names to connect to a
                resource.
              </Text>
              <Text className="text-muted-foreground">
                For more information, check{" "}
                <Text
                  className="underline"
                  onPress={() =>
                    openBrowserAsync(
                      "https://coolify.io/docs/knowledge-base/docker/compose#connect-to-predefined-networks"
                    )
                  }
                >
                  this
                </Text>
                .
              </Text>
            </View>
          }
        />
        <Controller
          control={control}
          name="connect_to_docker_network"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              checked={value ?? false}
              onCheckedChange={onChange}
              disabled
            />
          )}
        />
      </View>
      <View className="flex-1 gap-1 h-[50vh]">
        <InfoDialog
          label="Docker Compose"
          title="Edit Docker Compose"
          description="Volume names are updated upon save. The service UUID will be added
              as a prefix to all volumes, to prevent name collision. To see the
              actual volume names, check the Deployable Compose file."
        />
        <Controller
          control={control}
          name="docker_compose_raw"
          disabled={showDeployableCompose}
          render={({ field: { onChange, onBlur, value, disabled } }) => (
            <Textarea
              className="flex-1"
              placeholder="Docker Compose"
              onChangeText={onChange}
              onBlur={onBlur}
              value={showDeployableCompose ? data.docker_compose : value}
              editable={false}
            />
          )}
        />
        <View className="flex-row gap-2 items-center">
          <Button
            variant="secondary"
            onPress={() => setShowDeployableCompose((prev) => !prev)}
          >
            <Text>
              {showDeployableCompose
                ? "Show Source Compose"
                : "Show Deployable Compose"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
