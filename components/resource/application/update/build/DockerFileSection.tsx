import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function DockerfileSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-1 mt-6">
      <InfoDialog label="Dockerfile" />
      <Controller
        control={control}
        name="dockerfile"
        render={({ field: { onChange, value, onBlur } }) => (
          <Textarea
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={`FROM nginx\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`}
            autoCapitalize="none"
            autoComplete="off"
            className="flex-1"
            numberOfLines={Math.min(10, (value ?? "").split("\n").length + 3)}
          />
        )}
      />
    </View>
  );
}
