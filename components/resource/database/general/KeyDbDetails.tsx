import { UpdateKeyDBDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { PasswordInput } from "@/components/ui/input";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function KeyDbDetails({
  control,
}: {
  control: Control<UpdateKeyDBDatabaseBody>;
}) {
  return (
    <Controller
      control={control}
      name="keydb_password"
      disabled
      render={({ field: { value, onChange, disabled } }) => (
        <View className="flex-1 gap-1">
          <InfoDialog
            label="Initial Password"
            description="You can only change this in the database."
          />
          <PasswordInput
            placeholder="There should be a password here"
            value={value}
            editable={!disabled}
            onChange={onChange}
          />
        </View>
      )}
    />
  );
}
