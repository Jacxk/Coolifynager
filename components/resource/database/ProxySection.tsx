import {
  Database,
  isMariaDBDatabase,
  isMongoDBDatabase,
  isMySQLDatabase,
  isPostgreSQLDatabase,
  isRedisDatabase,
  UpdateDatabaseBody,
} from "@/api/types/database.types";
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
import { MariaDBConfiguration } from "./general/MariaDbDetails";
import { MongoDbConfiguration } from "./general/MongoDbDetails";
import { MysqlConfiguration } from "./general/MysqlDetails";
import { PostgresConfiguration } from "./general/PostgressDetails";
import { RedisConfiguration } from "./general/RedisDetails";

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
      {isPostgreSQLDatabase(database) && (
        <PostgresConfiguration control={control} />
      )}
      {isMongoDBDatabase(database) && (
        <MongoDbConfiguration control={control} />
      )}
      {isMariaDBDatabase(database) && (
        <MariaDBConfiguration control={control} />
      )}
      {isMySQLDatabase(database) && <MysqlConfiguration control={control} />}
      {isRedisDatabase(database) && <RedisConfiguration control={control} />}
    </View>
  );
}
