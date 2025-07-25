import { UpdateRedisDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { View } from "react-native";

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
