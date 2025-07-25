import {
  Database,
  isClickHouseDatabase,
  isDragonFlyDatabase,
  isKeyDBDatabase,
  isMariaDBDatabase,
  isMongoDBDatabase,
  isMySQLDatabase,
  isPostgreSQLDatabase,
  isRedisDatabase,
  UpdateDatabaseBody,
} from "@/api/types/database.types";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import ClickhouseDetails from "./ClickhouseDetails";
import DragonflyDetails from "./DragonflyDetails";
import KeyDbDetails from "./KeyDbDetails";
import MariaDbDetails from "./MariaDbDetails";
import MongoDbDetails from "./MongoDbDetails";
import MysqlDetails from "./MysqlDetails";
import PostgressDetails from "./PostgressDetails";
import RedisDetails from "./RedisDetails";

export default function GeneralSection({
  control,
  errors,
  database,
}: {
  control: Control<UpdateDatabaseBody>;
  errors: FieldErrors<UpdateDatabaseBody>;
  database: Database;
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

      {isPostgreSQLDatabase(database) && (
        <PostgressDetails control={control} errors={errors} />
      )}
      {isMariaDBDatabase(database) && (
        <MariaDbDetails control={control} errors={errors} />
      )}
      {isDragonFlyDatabase(database) && <DragonflyDetails control={control} />}
      {isMongoDBDatabase(database) && (
        <MongoDbDetails control={control} errors={errors} />
      )}
      {isMySQLDatabase(database) && (
        <MysqlDetails control={control} errors={errors} />
      )}
      {isClickHouseDatabase(database) && (
        <ClickhouseDetails control={control} />
      )}
      {isKeyDBDatabase(database) && <KeyDbDetails control={control} />}
      {isRedisDatabase(database) && <RedisDetails control={control} />}
    </View>
  );
}
