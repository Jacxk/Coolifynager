import { UpdateDatabaseBody } from "@/api/types/database.types";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import PostgressDetails from "./PostgressDetails";

export default function GeneralSection({
  control,
  errors,
}: {
  control: Control<UpdateDatabaseBody>;
  errors: FieldErrors<UpdateDatabaseBody>;
}) {
  return (
    <View className="gap-2">
      <H3>General</H3>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Image</Text>
        <Controller
          control={control}
          name="image"
          rules={{ required: "Image is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Image"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.image && (
          <Text className="text-red-500">{errors.image.message}</Text>
        )}
      </View>
      <Text className="text-yellow-500">
        If you change the values in the database, please sync it here, otherwise
        automations (like backups) won't work.
      </Text>

      <PostgressDetails control={control} errors={errors} />
    </View>
  );
}
