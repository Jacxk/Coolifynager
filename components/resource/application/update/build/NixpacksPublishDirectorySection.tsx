import { UpdateApplicationBody } from "@/api/types/application.types";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function NixpacksPublishDirectorySection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
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
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );
}
