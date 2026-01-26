import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function DeploymentCommandsSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-2">
      <H3>Pre/Post Deployment Commands</H3>
      <View className="gap-1">
        <InfoDialog
          label="Pre-deployment"
          description="An optional script or command to execute in the existing container before the deployment begins.
          It is always executed with 'sh -c', so you do not need add it manually."
        />
        <Controller
          control={control}
          name="pre_deployment_command"
          render={({ field: { onChange, value, onBlur }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="php artisan migrate"
            />
          )}
        />
      </View>
      <View className="gap-1">
        <InfoDialog
          label="Post-deployment"
          description="An optional script or command to execute in the newly built container after the deployment completes.
          It is always executed with 'sh -c', so you do not need add it manually."
        />
        <Controller
          control={control}
          name="post_deployment_command"
          render={({ field: { onChange, value, onBlur }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="php artisan migrate"
            />
          )}
        />
      </View>
    </View>
  );
}
