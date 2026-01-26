import { UpdateDragonFlyDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import { PasswordInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export default function DragonflyDetails({
  control,
}: {
  control: Control<UpdateDragonFlyDatabaseBody>;
}) {
  return (
    <Controller
      control={control}
      name="dragonfly_password"
      disabled
      render={({ field: { value, onChange, disabled }, fieldState: { isDirty } }) => (
        <View className="flex-1 gap-1">
          <InfoDialog
            label="Initial Password"
            description="You can only change this in the database."
          />
          <PasswordInput
            className={cn({
              "border-yellow-500": isDirty,
            })}
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
