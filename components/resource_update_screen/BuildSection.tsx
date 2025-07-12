import {
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { openBrowserAsync } from "expo-web-browser";
import {
  Control,
  Controller,
  FieldErrors,
  useController,
} from "react-hook-form";
import { View } from "react-native";
import InfoDialog from "../InfoDialog";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
import { H3 } from "../ui/typography";

function NixpacksSection({
  control,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
}) {
  return (
    <>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Install Command</Text>
          <InfoDialog
            title="Install Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="install_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Install Command"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Build Command</Text>
          <InfoDialog
            title="Build Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="build_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Build Command"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Start Command</Text>
          <InfoDialog
            title="Start Command"
            description="If you modify this, you probably need to have a nixpacks.toml"
          />
        </View>
        <Controller
          control={control}
          name="start_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter Start Command"
            />
          )}
        />
      </View>
      <Text className="text-muted-foreground text-sm">
        Nixpacks will detect the required configuration automatically.{" "}
        <Text
          className="underline text-sm"
          onPress={() =>
            openBrowserAsync("https://coolify.io/docs/applications/")
          }
        >
          Framework Specific Docs
        </Text>
      </Text>
    </>
  );
}

function NixpacksPublishDirectorySection({
  control,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
}) {
  return (
    <View className="gap-1">
      <Text className="text-muted-foreground">Publish Directory</Text>
      <Controller
        control={control}
        name="base_directory"
        render={({ field: { onChange, value, onBlur } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Enter Publish Directory"
          />
        )}
      />
    </View>
  );
}

function DockerComposeSection({
  control,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
}) {
  return (
    <>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Docker Compose Location</Text>
          <InfoDialog
            title="Docker Compose Location"
            description={
              <Text className="text-muted-foreground">
                It is calculated together with the Base Directory:{" "}
                <Text className="text-yellow-500">/docker-compose.yaml</Text>
              </Text>
            }
          />
        </View>
        <Controller
          control={control}
          name="docker_compose_location"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="/docker-compose.yaml"
            />
          )}
        />
      </View>
      <Text className="text-muted-foreground mt-6">
        The following commands are for advanced use cases. Only modify them if
        you know what are you doing.
      </Text>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Custom Build Command</Text>
          <InfoDialog
            title="Custom Build Command"
            description={
              <View className="gap-4">
                <Text className="text-muted-foreground">
                  If you use this, you need to specify paths relatively and
                  should use the same compose file in the custom command,
                  otherwise the automatically configured labels / etc won't
                  work.
                </Text>
                <Text className="text-muted-foreground">
                  So in your case, use:{" "}
                  <Text className="text-yellow-500">
                    docker compose -f ./docker-compose.yaml build
                  </Text>
                </Text>
              </View>
            }
          />
        </View>
        <Controller
          control={control}
          name="docker_compose_custom_build_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="docker compose build"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Custom Start Command</Text>
          <InfoDialog
            title="Custom Start Command"
            description={
              <View className="gap-4">
                <Text className="text-muted-foreground">
                  If you use this, you need to specify paths relatively and
                  should use the same compose file in the custom command,
                  otherwise the automatically configured labels / etc won't
                  work.
                </Text>
                <Text className="text-muted-foreground">
                  So in your case, use:{" "}
                  <Text className="text-yellow-500">
                    docker compose -f ./docker-compose.yaml up -d
                  </Text>
                </Text>
              </View>
            }
          />
        </View>
        <Controller
          control={control}
          name="docker_compose_custom_start_command"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="docker compose up -d"
            />
          )}
        />
      </View>
    </>
  );
}

function BaseSection({
  control,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
}) {
  return (
    <>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Watch Paths</Text>
          <InfoDialog
            title="Watch Paths"
            description="Gitignore-style rules to filter Git based webhook deployments."
          />
        </View>
        <Controller
          control={control}
          name="watch_paths"
          render={({ field: { onChange, value, onBlur } }) => (
            <Textarea
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="src/page/**"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Custom Docker Options</Text>
          <InfoDialog
            title="Custom Docker Options"
            description={
              <View className="gap-2">
                <Text className="text-muted-foreground">
                  You can add custom docker run options that will be used when
                  your container is started.
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
                        "https://coolify.io/docs/knowledge-base/docker/custom-commands"
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
        </View>
        <Controller
          control={control}
          name="custom_docker_run_options"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="--cap-add SYS_ADMIN --device=/dev/fuse --security-opt apparmor:unconfined --ulimit nofile=1024:1024 --tmpfs /run:rw,noexec,nosuid,size=65536k --hostname=myapp"
            />
          )}
        />
      </View>
      <View className="gap-4 flex-row items-center">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Use a Build Server?</Text>
          <InfoDialog
            title="Use a Build Server?"
            description={
              <Text className="text-muted-foreground">
                Use a build server to build your application. You can configure
                your build server in the Server settings. For more info, check
                the{" "}
                <Text
                  className="underline"
                  onPress={() =>
                    openBrowserAsync(
                      "https://coolify.io/docs/knowledge-base/server/build-server"
                    )
                  }
                >
                  documentation
                </Text>
                .
              </Text>
            }
          />
        </View>
        <Controller
          control={control}
          name="use_build_server"
          render={({ field: { onChange, value } }) => (
            <Checkbox checked={value ?? false} onCheckedChange={onChange} />
          )}
        />
      </View>
    </>
  );
}

export default function BuildSection({
  control,
  errors,
}: {
  control: Control<Partial<UpdateApplicationBody>>;
  errors: FieldErrors<Partial<UpdateApplicationBody>>;
}) {
  const {
    field: { value: buildPack },
  } = useController({
    control,
    name: "build_pack",
  });

  if (buildPack === BuildPack.dockerfile) return null;
  return (
    <>
      {
        <View className="gap-2">
          <H3>Build</H3>
          {buildPack === BuildPack.nixpacks && (
            <NixpacksSection control={control} />
          )}
          <View className="gap-1">
            <View className="flex-row items-center">
              <Text className="text-muted-foreground">Base Directory</Text>
              <InfoDialog
                title="Base Directory"
                description="Directory to use as root. Useful for monorepos."
              />
            </View>
            <Controller
              control={control}
              name="base_directory"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input value={value} onChangeText={onChange} onBlur={onBlur} />
              )}
            />
          </View>
          {buildPack === BuildPack.nixpacks && (
            <NixpacksPublishDirectorySection control={control} />
          )}
          {buildPack === BuildPack.dockercompose && (
            <DockerComposeSection control={control} />
          )}
          {buildPack !== BuildPack.dockercompose && (
            <BaseSection control={control} />
          )}
        </View>
      }
    </>
  );
}
