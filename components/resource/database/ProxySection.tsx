import { UpdateDatabaseBody } from "@/api/types/database.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function ProxySection({
  control,
}: {
  control: Control<UpdateDatabaseBody>;
}) {
  return (
    <View className="gap-2">
      <H3>Proxy</H3>
      <View className="flex-1 gap-4 flex-row">
        <Text className="text-muted-foreground">
          Make it publicly available
        </Text>
        <Controller
          control={control}
          name="is_public"
          render={({ field: { value, onChange } }) => (
            <Checkbox checked={value ?? false} onCheckedChange={onChange} />
          )}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Public Port</Text>
        <Controller
          control={control}
          name="public_port"
          render={({ field: { value, onChange } }) => (
            <Input
              keyboardType="number-pad"
              placeholder="5432"
              value={value?.toString() ?? ""}
              onChangeText={(text) => onChange(Number(text))}
            />
          )}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">
          Custom PostgreSQL Configuration
        </Text>
        <Controller
          control={control}
          name="postgres_conf"
          render={({ field: { value, onChange } }) => (
            <Textarea
              className="h-40"
              value={value ?? ""}
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </View>
  );
}
