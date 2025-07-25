import { UpdateMySQLDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";

export function MysqlConfiguration({
  control,
}: {
  control: Control<UpdateMySQLDatabaseBody>;
}) {
  return (
    <View className="flex-1 gap-1">
      <Text className="text-muted-foreground">Custom MySQL Configuration</Text>
      <Controller
        control={control}
        name="mysql_conf"
        render={({ field: { value, onChange } }) => (
          <Textarea
            className="h-40"
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />
    </View>
  );
}

export default function MysqlDetails({
  control,
  errors,
}: {
  control: Control<UpdateMySQLDatabaseBody>;
  errors: FieldErrors<UpdateMySQLDatabaseBody>;
}) {
  const description =
    "If you change this in the database, please sync it here, otherwise automations (like backups) won't work.";
  return (
    <>
      <View className="flex-1 gap-1">
        <InfoDialog label="Root Password" description={description} />
        <Controller
          control={control}
          name="mysql_root_password"
          rules={{ required: "Root Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.mysql_root_password && (
          <Text className="text-red-500">
            {errors.mysql_root_password.message}
          </Text>
        )}
      </View>
      <View className="flex-1 gap-1">
        <InfoDialog label="Normal User" description={description} />
        <Controller
          control={control}
          name="mysql_user"
          rules={{ required: "Normal User is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={onChange} onBlur={onBlur} value={value} />
          )}
        />
        {errors.mysql_user && (
          <Text className="text-red-500">{errors.mysql_user.message}</Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog label="Normal User Password" description={description} />
        <Controller
          control={control}
          name="mysql_password"
          rules={{ required: "Normal User Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.mysql_password && (
          <Text className="text-red-500">{errors.mysql_password.message}</Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Initial Database"
          description="You can only change this in the database."
        />
        <Controller
          control={control}
          name="mysql_database"
          disabled
          render={({ field: { onChange, onBlur, value, disabled } }) => (
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              editable={!disabled}
            />
          )}
        />
      </View>
    </>
  );
}
