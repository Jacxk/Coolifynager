import { UpdateMongoDBDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { View } from "react-native";

export function MongoDbConfiguration({
  control,
}: {
  control: Control<UpdateMongoDBDatabaseBody>;
}) {
  return (
    <View className="flex-1 gap-1">
      <Text className="text-muted-foreground">
        Custom MongoDB Configuration
      </Text>
      <Controller
        control={control}
        name="mongo_conf"
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

export default function MongoDbDetails({
  control,
  errors,
}: {
  control: Control<UpdateMongoDBDatabaseBody>;
  errors: FieldErrors<UpdateMongoDBDatabaseBody>;
}) {
  const database = useWatch({ control, name: "mongo_initdb_database" });
  const description =
    "If you change this in the database, please sync it here, otherwise automations (like backups) won't work.";

  return (
    <>
      <View className="flex-1 gap-1">
        <InfoDialog label="Initial Username" description={description} />
        <Controller
          control={control}
          name="mongo_initdb_root_username"
          rules={{ required: "Username is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="If empty: postgres"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.mongo_initdb_root_username && (
          <Text className="text-red-500">
            {errors.mongo_initdb_root_username.message}
          </Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog label="Initial Password" description={description} />
        <Controller
          control={control}
          name="mongo_initdb_root_password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              placeholder="Enter DB password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.mongo_initdb_root_password && (
          <Text className="text-red-500">
            {errors.mongo_initdb_root_password.message}
          </Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Initial Database"
          description="You can only change this in the database."
        />
        <Input
          placeholder="If empty, it will be the same as Username."
          editable={false}
          value={database}
        />
      </View>
    </>
  );
}
