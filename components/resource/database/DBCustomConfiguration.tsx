import {
  CoolifyDatabaseType,
  UpdateDatabaseBody,
} from "@/api/types/database.types";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Control, Controller, Path } from "react-hook-form";
import { View } from "react-native";

export default function DBCustomConfiguration({
  control,
  type,
}: {
  control: Control<UpdateDatabaseBody>;
  type: CoolifyDatabaseType;
}) {
  let name: Path<UpdateDatabaseBody> | null = null;
  let label = "";

  if (type === CoolifyDatabaseType.REDIS) {
    name = "redis_conf";
    label = "Redis";
  } else if (type === CoolifyDatabaseType.MARIADB) {
    name = "mariadb_conf";
    label = "MariaDB";
  } else if (type === CoolifyDatabaseType.MYSQL) {
    name = "mysql_conf";
    label = "MySQL";
  } else if (type === CoolifyDatabaseType.POSTGRESQL) {
    name = "postgres_conf";
    label = "PostgreSQL";
  } else if (type === CoolifyDatabaseType.MONGODB) {
    name = "mongo_conf";
    label = "MongoDB";
  }

  if (!name) return null;

  return (
    <View className="flex-1 gap-1">
      <Text className="text-muted-foreground">
        Custom {label} Configuration
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { isDirty } }) => (
          <Textarea
            className={cn("h-40", {
              "border-yellow-500": isDirty,
            })}
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />
    </View>
  );
}
