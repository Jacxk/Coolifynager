import {
  ApplicationType,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { openBrowserAsync } from "expo-web-browser";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

function WatchPathsController({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-1">
      <InfoDialog
        label="Watch Paths"
        description="Gitignore-style rules to filter Git based webhook deployments."
      />
      <Controller
        control={control}
        name="watch_paths"
        render={({
          field: { onChange, value, onBlur },
          fieldState: { isDirty },
        }) => (
          <Textarea
            className={cn({
              "border-yellow-500": isDirty,
            })}
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="src/page/**"
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );
}

function DockerBuildStageTargetController({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-1">
      <InfoDialog
        label="Docker Build Stage Target"
        description="Useful if you have multi-staged dockerfile"
      />
      <Controller
        control={control}
        name="dockerfile_target_build"
        render={({
          field: { onChange, value, onBlur },
          fieldState: { isDirty },
        }) => (
          <Input
            className={cn({
              "border-yellow-500": isDirty,
            })}
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder=""
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );
}

function UseBuildServerController({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <Controller
      control={control}
      name="use_build_server"
      render={({ field: { onChange, value }, fieldState: { isDirty } }) => (
        <Checkbox checked={value ?? false} onCheckedChange={onChange}>
          <CheckboxLabel asChild>
            <InfoDialog
              label="Use a Build Server?"
              description={
                <Text className="text-muted-foreground">
                  Use a build server to build your application. You can
                  configure your build server in the Server settings. For more
                  info, check the{" "}
                  <Text
                    className="underline"
                    onPress={() =>
                      openBrowserAsync(
                        "https://coolify.io/docs/knowledge-base/server/build-server",
                      )
                    }
                  >
                    documentation
                  </Text>
                  .
                </Text>
              }
            />
          </CheckboxLabel>
          <CheckboxIcon className={cn({ "border-yellow-500": isDirty })} />
        </Checkbox>
      )}
    />
  );
}

function CustomDockerOptionsController({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-1">
      <InfoDialog
        label="Custom Docker Options"
        description={
          <View className="gap-2">
            <Text className="text-muted-foreground">
              You can add custom docker run options that will be used when your
              container is started.
            </Text>
            <Text className="text-muted-foreground">
              Note: Not all options are supported, as they could mess up
              Coolify's automation and could cause bad experience for users.
            </Text>
            <Text className="text-muted-foreground mt-4">
              Check the{" "}
              <Text
                className="underline"
                onPress={() =>
                  openBrowserAsync(
                    "https://coolify.io/docs/knowledge-base/docker/custom-commands",
                  )
                }
              >
                docs
              </Text>
              .
            </Text>
          </View>
        }
      />
      <Controller
        control={control}
        name="custom_docker_run_options"
        render={({
          field: { onChange, value, onBlur },
          fieldState: { isDirty },
        }) => (
          <Input
            className={cn({
              "border-yellow-500": isDirty,
            })}
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="--cap-add SYS_ADMIN --device=/dev/fuse --security-opt apparmor:unconfined --ulimit nofile=1024:1024 --tmpfs /run:rw,noexec,nosuid,size=65536k --hostname=myapp"
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );
}

export default function BaseSection({
  control,
  applicationType = "Standalone",
}: {
  control: Control<UpdateApplicationBody>;
  applicationType?: ApplicationType;
}) {
  if (applicationType === "Dockerfile")
    return (
      <>
        <DockerBuildStageTargetController control={control} />
        <CustomDockerOptionsController control={control} />
        <UseBuildServerController control={control} />
      </>
    );

  if (applicationType === "DockerImage")
    return <CustomDockerOptionsController control={control} />;

  return (
    <>
      <WatchPathsController control={control} />
      <CustomDockerOptionsController control={control} />
      <UseBuildServerController control={control} />
    </>
  );
}
