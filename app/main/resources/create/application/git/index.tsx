import { getPrivateKeys } from "@/api/private-keys";
import {
  BuildPack,
  CoolifyApplications,
  CreateApplicationBodyGit,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { DockerComposeLocationController } from "@/components/resource/application/update/build/DockerComposeSection";
import { BaseDirectoryController } from "@/components/resource/application/update/BuildSection";
import { BuildPackSelectController } from "@/components/resource/application/update/GeneralSection";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function BuildPackController({
  control,
}: {
  control: Control<CreateApplicationBodyGit>;
}) {
  const isStatic = useWatch({
    control,
    name: "is_static",
  });

  const buildPack = useWatch({
    control,
    name: "build_pack",
  });

  return (
    <>
      {isStatic && buildPack === BuildPack.nixpacks && (
        <Controller
          control={control}
          name="publish_directory"
          defaultValue="/dist"
          render={({ field: { onChange, value, onBlur } }) => (
            <View className="gap-1">
              <InfoDialog
                label="Publish Directory"
                description="If there is a build process involved (like Svelte, React, Next, etc..), please specify the output directory for the build assets"
              />
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                placeholder="/public"
                autoComplete="off"
                autoCorrect={false}
              />
            </View>
          )}
        />
      )}
      <BuildPackSelectController control={control} />
      <BaseDirectoryController control={control} />
      <BuildPackControllerDynamic control={control} />
    </>
  );
}

function BuildPackControllerDynamic({
  control,
}: {
  control: Control<CreateApplicationBodyGit>;
}) {
  const buildPack = useWatch({
    control,
    name: "build_pack",
  });

  if (buildPack === BuildPack.nixpacks) {
    return (
      <>
        <Controller
          control={control}
          name="ports_exposes"
          render={({ field: { onChange, value, onBlur } }) => (
            <View className="gap-1">
              <InfoDialog
                label="Port"
                description="The port your application listens on."
              />
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
                placeholder="3000"
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="is_static"
          render={({ field: { onChange, value, onBlur } }) => (
            <Checkbox
              checked={value ?? false}
              onCheckedChange={onChange}
              onBlur={onBlur}
            >
              <CheckboxLabel asChild>
                <InfoDialog
                  label="Is it a static site?"
                  description="If your application is a static site or the final build assets should be served as a static site, enable this."
                />
              </CheckboxLabel>
              <CheckboxIcon />
            </Checkbox>
          )}
        />
      </>
    );
  } else if (buildPack === BuildPack.dockercompose) {
    return <DockerComposeLocationController control={control} />;
  }
}

function PrivateKeySection({
  control,
  enabled,
}: {
  control: Control<CreateApplicationBodyGit>;
  enabled: boolean;
}) {
  const [isPrivateRepo, setIsPrivateRepo] = useState(enabled);
  useQuery(getPrivateKeys());

  return (
    <View className="gap-1">
      <Checkbox checked={isPrivateRepo} onCheckedChange={setIsPrivateRepo}>
        <CheckboxLabel>Is this a private repository?</CheckboxLabel>
        <CheckboxIcon />
      </Checkbox>
      {isPrivateRepo && <PrivateKeyController control={control} />}
    </View>
  );
}

function PrivateKeyController({
  control,
}: {
  control: Control<CreateApplicationBodyGit>;
}) {
  const { data: privateKeys, isLoading } = useQuery(getPrivateKeys());

  if (isLoading) {
    return (
      <Text className="text-muted-foreground">Loading private keys...</Text>
    );
  }

  if (!privateKeys) {
    return (
      <Text className="text-muted-foreground">
        No private keys found, please create a private key first.
      </Text>
    );
  }

  const gitRelatedPrivateKeys = privateKeys?.filter(
    (key) => key.is_git_related
  );

  return (
    <Controller
      control={control}
      name="private_key_uuid"
      rules={{
        required: "Private key is required",
      }}
      render={({ field: { onChange } }) => (
        <View className="gap-1">
          <InfoDialog
            label="Private Key"
            description="The private key to use for the application."
          />
          <Select onValueChange={(val) => onChange(val)}>
            <SelectTrigger>
              <SelectValue
                className="text-foreground"
                placeholder="Select a private key"
              />
            </SelectTrigger>
            <SelectContent>
              {gitRelatedPrivateKeys?.map((privateKey) => (
                <SelectItem
                  key={privateKey.uuid}
                  value={privateKey.uuid}
                  label={privateKey.name}
                >
                  {privateKey.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>
      )}
    />
  );
}

export default function CreateGitRepositoryApplication() {
  const { environment_uuid, server_uuid, project_uuid, type } =
    useLocalSearchParams<{
      environment_uuid: string;
      server_uuid: string;
      project_uuid: string;
      type: CoolifyApplications;
    }>();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateApplicationBodyGit>({
    shouldUnregister: true,
    defaultValues: {
      git_branch: "main",
      git_repository: "",
      ports_exposes: "3000",
      build_pack: BuildPack.nixpacks,
      base_directory: "/",
      docker_compose_location: "/docker-compose.yaml",
      publish_directory: "/dist",
      is_static: false,
      private_key_uuid: "",
    },
  });

  const { handleCreateApplication, isPending } = useCreateApplication(
    CoolifyApplications.PUBLIC_REPOSITORY,
    {
      environment_uuid,
      server_uuid,
      project_uuid,
    }
  );

  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="gap-4 flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <PrivateKeySection
        control={control}
        enabled={type === CoolifyApplications.PRIVATE_REPOSITORY_DEPLOY_KEY}
      />
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
          <View className="gap-1">
            <InfoDialog
              label="Repository URL (https://)"
              description={
                <View className="gap-3">
                  <Text className="text-base font-semibold text-amber-400">
                    Examples
                  </Text>

                  <View>
                    <Text className="text-sm text-muted-foreground">
                      For Public repositories, use{" "}
                      <Text className="text-amber-400">https://</Text>
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      For Private repositories, use{" "}
                      <Text className="text-amber-400">git@</Text>
                    </Text>
                  </View>

                  <View className="gap-2">
                    <Text className="text-sm text-muted-foreground">
                      * https://github.com/coollabsio/coolify-examples
                      <Text className="text-amber-400">{" main "}</Text>
                      branch will be selected
                    </Text>

                    <Text className="text-sm text-muted-foreground">
                      *
                      https://github.com/coollabsio/coolify-examples/tree/nodejs-fastify
                      <Text className="text-amber-400">
                        {" nodejs-fastify "}
                      </Text>
                      branch will be selected
                    </Text>

                    <Text className="text-sm text-muted-foreground">
                      * https://gitea.com/sedlav/expressjs.git
                      <Text className="text-amber-400">{" main "}</Text>
                      branch will be selected
                    </Text>

                    <Text className="text-sm text-muted-foreground">
                      * https://gitlab.com/andrasbacsai/nodejs-example.git
                      <Text className="text-amber-400">{" main "}</Text>
                      branch will be selected
                    </Text>
                  </View>
                </View>
              }
            />
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="url"
            />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />
      <Text className="text-muted-foreground">
        For example application deployments, checkout{" "}
        <Link
          href="https://github.com/coollabsio/coolify-examples/"
          className="underline text-foreground"
        >
          Coolify Examples
        </Link>
        .
      </Text>
      <Controller
        control={control}
        name="git_branch"
        render={({ field: { onChange, onBlur, value, disabled } }) => (
          <View className="gap-1">
            <InfoDialog
              label="Branch"
              description="The default branch is main."
            />
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              editable={!disabled}
              autoCapitalize="none"
              autoComplete="off"
            />
          </View>
        )}
      />
      <BuildPackController control={control} />
      <Button
        onPress={handleSubmit(handleCreateApplication)}
        loading={isPending}
        disabled={!isValid}
      >
        <Text>Create</Text>
      </Button>
    </ScrollView>
  );
}
