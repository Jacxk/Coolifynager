import {
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typography";
import { Control, Controller, useController } from "react-hook-form";
import { View } from "react-native";
import BaseSection from "./build/BaseSection";
import DockerComposeSection from "./build/DockerComposeSection";
import NixpacksPublishDirectorySection from "./build/NixpacksPublishDirectorySection";
import NixpacksSection from "./build/NixpacksSection";

export default function BuildSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  const {
    field: { value: buildPack },
  } = useController({
    control,
    name: "build_pack",
  });

  if (buildPack === BuildPack.dockerfile) return null;
  return (
    <View className="gap-2">
      <H3>Build</H3>
      {buildPack === BuildPack.nixpacks && (
        <NixpacksSection control={control} />
      )}
      <View className="gap-1">
        <InfoDialog
          label="Base Directory"
          description="Directory to use as root. Useful for monorepos."
        />
        <Controller
          control={control}
          name="base_directory"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
            />
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
  );
}
