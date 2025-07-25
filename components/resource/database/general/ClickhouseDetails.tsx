import { UpdateClickHouseDatabaseBody } from "@/api/types/database.types";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function ClickhouseDetails({
  control,
}: {
  control: Control<UpdateClickHouseDatabaseBody>;
}) {
  return (
    <>
      <Controller
        control={control}
        name="clickhouse_admin_user"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="flex-1 gap-1">
            <Text className="text-muted-foreground">Username</Text>
            <Input
              placeholder="admin"
              value={value}
              editable={false}
              onChange={onChange}
            />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />
      <Controller
        control={control}
        name="clickhouse_admin_password"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="flex-1 gap-1">
            <Text className="text-muted-foreground">Password</Text>
            <PasswordInput
              placeholder="There should be a password here"
              value={value}
              editable={false}
              onChange={onChange}
            />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
      />
    </>
  );
}
