import {
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { Control, useController } from "react-hook-form";
import { View } from "react-native";

export default function DockerComposeSection({
  control,
  dockerComposeRaw,
  dockerCompose,
}: {
  control: Control<UpdateApplicationBody>;
  dockerComposeRaw: string;
  dockerCompose: string;
}) {
  const {
    field: { value: buildPack },
  } = useController({
    control,
    name: "build_pack",
  });

  if (buildPack !== BuildPack.dockercompose) return null;

  return (
    <View className="gap-2">
      <H3>Docker Compose</H3>

      <View className="gap-1">
        <InfoDialog
          label="Docker Compose Content (raw)"
          description="You need to modify the docker compose file in the git repository."
        />
        <Textarea
          value={dockerComposeRaw}
          editable={false}
          placeholder="Looks like you dont have a docker compose file"
        />
      </View>

      <View className="gap-1">
        <InfoDialog
          label="Docker Compose Content"
          description="You need to modify the docker compose file in the git repository."
        />
        <Textarea
          value={dockerCompose}
          editable={false}
          placeholder="Looks like you dont have a docker compose file"
        />
      </View>

      <View className="flex-row items-center gap-4">
        <InfoDialog
          label="Escape special characters in labels?"
          title="Soon"
          description="This property is not available yet."
        />
      </View>
    </View>
  );
}
