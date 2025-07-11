import {
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import InfoDialog from "../InfoDialog";
import { useConfiguration } from "../providers/ConfigurationProvider";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
import { H3 } from "../ui/typography";

function NixpacksSection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();
  const setInstallCommand = (value: string) => {
    updateConfiguration({
      install_command: value,
    });
  };

  const setBuildCommand = (value: string) => {
    updateConfiguration({
      build_command: value,
    });
  };

  const setStartCommand = (value: string) => {
    updateConfiguration({
      start_command: value,
    });
  };

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
        <Input
          placeholder="Enter Install Command"
          value={configuration.install_command ?? ""}
          onChangeText={setInstallCommand}
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
        <Input
          placeholder="Enter Build Command"
          value={configuration.build_command ?? ""}
          onChangeText={setBuildCommand}
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
        <Input
          placeholder="Enter Start Command"
          value={configuration.start_command ?? ""}
          onChangeText={setStartCommand}
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

function NixpacksPublishDirectorySection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();
  const setBaseDirectory = (value: string) => {
    updateConfiguration({
      base_directory: value,
    });
  };

  return (
    <View className="gap-1">
      <Text className="text-muted-foreground">Publish Directory</Text>
      <Input
        placeholder="Enter Publish Directory"
        value={configuration.base_directory ?? ""}
        onChangeText={setBaseDirectory}
      />
    </View>
  );
}

function DockerComposeSection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();
  const setDockerComposeLocation = (value: string) => {
    updateConfiguration({
      docker_compose_location: value,
    });
  };

  const setDockerComposeCustomBuildCommand = (value: string) => {
    updateConfiguration({
      docker_compose_custom_build_command: value,
    });
  };

  const setDockerComposeCustomStartCommand = (value: string) => {
    updateConfiguration({
      docker_compose_custom_start_command: value,
    });
  };

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
        <Input
          placeholder="/docker-compose.yaml"
          value={configuration.docker_compose_location ?? ""}
          onChangeText={setDockerComposeLocation}
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
        <Input
          placeholder="docker compose build"
          value={configuration.docker_compose_custom_build_command ?? ""}
          onChangeText={setDockerComposeCustomBuildCommand}
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
        <Input
          placeholder="docker compose up -d"
          value={configuration.docker_compose_custom_start_command ?? ""}
          onChangeText={setDockerComposeCustomStartCommand}
        />
      </View>
    </>
  );
}

function BaseSection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();
  const setWatchPaths = (value: string) => {
    updateConfiguration({
      watch_paths: value,
    });
  };

  const setCustomDockerRunOptions = (value: string) => {
    updateConfiguration({
      custom_docker_run_options: value,
    });
  };

  const setUseBuildServer = (value: boolean) => {
    updateConfiguration({
      use_build_server: value,
    });
  };

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
        <Textarea
          placeholder="src/page/**"
          value={configuration.watch_paths ?? ""}
          onChangeText={setWatchPaths}
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
        <Input
          placeholder="--cap-add SYS_ADMIN --device=/dev/fuse --security-opt apparmor:unconfined --ulimit nofile=1024:1024 --tmpfs /run:rw,noexec,nosuid,size=65536k --hostname=myapp"
          value={configuration.custom_docker_run_options ?? ""}
          onChangeText={setCustomDockerRunOptions}
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
        <Checkbox
          checked={configuration.use_build_server ?? false}
          onCheckedChange={setUseBuildServer}
        />
      </View>
    </>
  );
}

export default function BuildSection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();
  const setBuildPack = (value: BuildPack) => {
    updateConfiguration({
      build_pack: value,
    });
  };
  const setPublishDirectory = (value: string) => {
    updateConfiguration({
      base_directory: value,
    });
  };

  if (configuration.build_pack === BuildPack.dockerfile) return null;
  return (
    <>
      {
        <View className="gap-2">
          <H3>Build</H3>
          {configuration.build_pack === BuildPack.nixpacks && (
            <NixpacksSection />
          )}
          <View className="gap-1">
            <View className="flex-row items-center">
              <Text className="text-muted-foreground">Base Directory</Text>
              <InfoDialog
                title="Base Directory"
                description="Directory to use as root. Useful for monorepos."
              />
            </View>
            <Input
              placeholder="Enter Base Directory"
              value={configuration.base_directory ?? ""}
              onChangeText={setPublishDirectory}
            />
          </View>
          {configuration.build_pack === BuildPack.nixpacks && (
            <NixpacksPublishDirectorySection />
          )}
          {configuration.build_pack === BuildPack.dockercompose && (
            <DockerComposeSection />
          )}
          {configuration.build_pack !== BuildPack.dockercompose && (
            <BaseSection />
          )}
        </View>
      }
    </>
  );
}
