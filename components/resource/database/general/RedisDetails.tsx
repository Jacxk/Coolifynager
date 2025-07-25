import { UpdateRedisDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export function RedisConfiguration({
  control,
}: {
  control: Control<UpdateRedisDatabaseBody>;
}) {
  return (
    <View className="flex-1 gap-1">
      <Text className="text-muted-foreground">Custom Redis Configuration</Text>
      <Controller
        control={control}
        name="redis_conf"
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

export default function RedisDetails({
  control,
}: {
  control: Control<UpdateRedisDatabaseBody>;
}) {
  return (
    <>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="Username"
          description="You can only change this in the database."
        />
        <Input placeholder="No data available" editable={false} />
      </View>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="Password"
          description="You can only change this in the database."
        />
        <PasswordInput placeholder="No data available" editable={false} />
      </View>
    </>
  );
}
