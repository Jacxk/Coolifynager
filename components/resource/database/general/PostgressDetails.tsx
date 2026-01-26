import { UpdatePostgreSQLDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";

export default function PostgressDetails({
  control,
  errors,
}: {
  control: Control<UpdatePostgreSQLDatabaseBody>;
  errors: FieldErrors<UpdatePostgreSQLDatabaseBody>;
}) {
  return (
    <>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="Username"
          description="If you change this in the database, please sync it here,
           otherwise automations (like backups) won't work."
        />
        <Controller
          control={control}
          name="postgres_user"
          rules={{ required: "Username is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              placeholder="If empty: postgres"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.postgres_user && (
          <Text className="text-red-500">{errors.postgres_user.message}</Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Password"
          description="If you change this in the database, please sync it here,
           otherwise automations (like backups) won't work."
        />
        <Controller
          control={control}
          name="postgres_password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value }, fieldState: { isDirty } }) => (
            <PasswordInput
              className={cn({
                "border-yellow-500": isDirty,
              })}
              placeholder="Enter DB password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.postgres_password && (
          <Text className="text-red-500">
            {errors.postgres_password.message}
          </Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Initial Database"
          description="You can only change this in the database."
        />
        <Controller
          control={control}
          name="postgres_db"
          disabled
          render={({ field: { onChange, onBlur, value, disabled }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              placeholder="If empty, it will be the same as Username."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              editable={!disabled}
            />
          )}
        />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">
          Initial Database Arguments
        </Text>
        <Controller
          control={control}
          name="postgres_initdb_args"
          disabled
          render={({ field: { onChange, onBlur, value }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              placeholder="If empty, use default. See in docker docs."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ""}
            />
          )}
        />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Host Auth Method</Text>
        <Controller
          control={control}
          name="postgres_host_auth_method"
          disabled
          render={({ field: { onChange, onBlur, value }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              placeholder="If empty, use default. See in docker docs."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ""}
            />
          )}
        />
      </View>
    </>
  );
}
