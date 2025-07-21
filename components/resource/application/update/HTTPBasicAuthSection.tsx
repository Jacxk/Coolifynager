import {
  BuildPack,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { Buffer } from "buffer";
import {
  Control,
  Controller,
  FieldErrors,
  useController,
} from "react-hook-form";
import { View } from "react-native";

export default function HTTPBasicAuthSection({
  control,
  errors,
  readonlyLabels,
  setReadonlyLabels,
}: {
  control: Control<UpdateApplicationBody>;
  errors: FieldErrors<UpdateApplicationBody>;
  readonlyLabels: boolean;
  setReadonlyLabels: (value: boolean) => void;
}) {
  const {
    field: { value: isHttpBasicAuthEnabled },
  } = useController({
    control,
    name: "is_http_basic_auth_enabled",
  });

  const {
    field: { value: buildPack },
  } = useController({
    control,
    name: "build_pack",
  });

  if (buildPack === BuildPack.dockercompose) return null;

  return (
    <View className="gap-2">
      <H3>HTTP Basic Authentication</H3>
      <Controller
        control={control}
        name="is_http_basic_auth_enabled"
        render={({ field: { onChange, value } }) => (
          <Checkbox checked={value ?? false} onCheckedChange={onChange}>
            <CheckboxLabel asChild>
              <InfoDialog
                label="Enable"
                description="This will add the proper proxy labels to the container."
              />
            </CheckboxLabel>
            <CheckboxIcon />
          </Checkbox>
        )}
      />
      {isHttpBasicAuthEnabled && (
        <>
          <View className="gap-1">
            <Text className="text-muted-foreground">Username</Text>
            <Controller
              control={control}
              name="http_basic_auth_username"
              rules={{ required: "Username is required" }}
              render={({ field: { onChange, value } }) => (
                <Input value={value ?? ""} onChangeText={onChange} />
              )}
            />
            {errors.http_basic_auth_username && (
              <Text className="text-red-500">
                {errors.http_basic_auth_username.message}
              </Text>
            )}
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground">Password</Text>
            <Controller
              control={control}
              name="http_basic_auth_password"
              rules={{ required: "Password is required" }}
              render={({ field: { onChange, value } }) => (
                <Input value={value ?? ""} onChangeText={onChange} />
              )}
            />
            {errors.http_basic_auth_password && (
              <Text className="text-red-500">
                {errors.http_basic_auth_password.message}
              </Text>
            )}
          </View>
        </>
      )}
      <View className="gap-1">
        <Text className="text-muted-foreground">Container Labels</Text>
        <Controller
          control={control}
          name="custom_labels"
          disabled={readonlyLabels}
          render={({ field: { onChange, value, disabled } }) => (
            <Textarea
              value={Buffer.from(value ?? "", "base64").toString("utf-8")}
              onChangeText={(text) =>
                onChange(Buffer.from(text, "utf-8").toString("base64"))
              }
              placeholder="Start typing here"
              editable={!disabled}
            />
          )}
        />
      </View>

      <Checkbox checked={readonlyLabels} onCheckedChange={setReadonlyLabels}>
        <CheckboxLabel asChild>
          <InfoDialog
            label="Readonly labels"
            description={
              <View className="gap-2">
                <Text className="text-muted-foreground">
                  Labels are readonly by default. Readonly means that edits you
                  do to the labels could be lost and Coolify will autogenerate
                  the labels for you. If you want to edit the labels directly,
                  disable this option.
                </Text>
                <Text className="text-muted-foreground">
                  Be careful, it could break the proxy configuration after you
                  restart the container as Coolify will now NOT autogenerate the
                  labels for you (ofc you can always reset the labels to the
                  coolify defaults manually).
                </Text>
              </View>
            }
          />
        </CheckboxLabel>
        <CheckboxIcon />
      </Checkbox>

      <View className="flex-row items-center gap-4">
        <InfoDialog
          label="Escape special characters in labels?"
          title="Soon"
          description="This property is not available yet."
        />
      </View>
    </View>
  );
}
