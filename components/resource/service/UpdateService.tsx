import { useUpdateService } from "@/api/services";
import { ResourceHttpError } from "@/api/types/resources.types";
import { Service, UpdateServiceBody } from "@/api/types/services.types";
import InfoDialog from "@/components/InfoDialog";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { useEditing } from "@/context/EditingContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";

const getInitialValues = (data: Service): UpdateServiceBody => ({
  name: data.name,
  description: data.description,
  connect_to_docker_network: data.connect_to_docker_network,
  docker_compose_raw: data.docker_compose_raw,
  docker_compose: data.docker_compose,
  project_uuid: "",
  server_uuid: data.server.uuid,
});

export default function UpdateService({ data }: { data: Service }) {
  const { setIsEditing } = useEditing();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateServiceBody>({
    values: getInitialValues(data),
  });
  const [showDeployableCompose, setShowDeployableCompose] = useState(false);
  const { mutateAsync: saveChanges } = useUpdateService(data.uuid);

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
      <Controller
        control={control}
        name="connect_to_docker_network"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={value ?? false}
            onCheckedChange={onChange}
            disabled
          >
            <CheckboxLabel asChild>
              <InfoDialog
                label="Connect To Predefined Network"
                description={
                  <View className="gap-2">
                    <Text className="text-muted-foreground">
                      By default, you do not reach the Coolify defined networks.
                      Starting a docker compose based resource will have an
                      internal network. If you connect to a Coolify defined
                      network, you maybe need to use different internal DNS
                      names to connect to a resource.
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
            </CheckboxLabel>
            <CheckboxIcon />
          </Checkbox>
        )}
      />
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
