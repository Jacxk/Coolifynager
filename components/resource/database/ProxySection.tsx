import { Database, UpdateDatabaseBody } from "@/api/types/database.types";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import DBCustomConfiguration from "./DBCustomConfiguration";

export default function ProxySection({
  control,
  database,
}: {
  control: Control<UpdateDatabaseBody>;
  database: Database;
}) {
  return (
    <View className="gap-2">
      <H3>Proxy</H3>
      <Controller
        control={control}
        name="is_public"
        render={({ field: { value, onChange } }) => (
          <Checkbox checked={value ?? false} onCheckedChange={onChange}>
            <CheckboxLabel>Make it publicly available</CheckboxLabel>
            <CheckboxIcon />
          </Checkbox>
        )}
      />
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Public Port</Text>
        <Controller
          control={control}
          name="public_port"
          render={({ field: { value, onChange } }) => (
            <Input
              keyboardType="number-pad"
              placeholder="5432"
              value={value?.toString()}
              onChangeText={(text) => onChange(Number(text))}
            />
          )}
        />
      </View>
      <DBCustomConfiguration control={control} type={database.database_type} />
    </View>
  );
}
