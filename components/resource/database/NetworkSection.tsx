import { UpdateDatabaseBody } from "@/api/types/database.types";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function NetworkSection({
  control,
  internal_db_url,
}: {
  control: Control<UpdateDatabaseBody>;
  internal_db_url: string | null;
}) {
  return (
    <View className="gap-2">
      <H3>Network</H3>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Ports Mappings</Text>
        <Controller
          control={control}
          name="ports_mappings"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="3000:5432"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ""}
            />
          )}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Postgres URL (internal)</Text>
        <Input
          value={internal_db_url ?? ""}
          readOnly
          secureTextEntry
          scrollEnabled
        />
      </View>
    </View>
  );
}
