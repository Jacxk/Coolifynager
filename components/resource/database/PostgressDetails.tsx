import { UpdateDatabaseBody } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { openBrowserAsync } from "expo-web-browser";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { View } from "react-native";

export default function PostgressDetails({
  control,
  errors,
  custom_docker_run_options,
}: {
  control: Control<UpdateDatabaseBody>;
  errors: FieldErrors<UpdateDatabaseBody>;
  custom_docker_run_options: string | null;
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
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
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
          render={({ field: { onChange, onBlur, value, disabled } }) => (
            <Input
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
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="If empty, use default. See in docker docs."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ""}
            />
          )}
        />
      </View>

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Custom Docker Options"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                You can add custom docker run options that will be used when
                your container is started. Note: Not all options are supported,
                as they could mess up Coolify's automation and could cause bad
                experience for users.
              </Text>
              <Text className="text-muted-foreground">
                Check the{" "}
                <Text
                  onPress={() =>
                    openBrowserAsync(
                      "https://coolify.io/docs/knowledge-base/docker/custom-commands"
                    )
                  }
                  className="underline"
                >
                  docs
                </Text>
                .
              </Text>
              <ReadOnlyText />
            </View>
          }
        />
        <Input
          placeholder="--cap-add SYS_ADMIN --device=/dev/fuse --security-opt apparmor:unconfined --ulimit nofile=1024:1024 --tmpfs /run:rw,noexec,nosuid,size=65536k"
          value={custom_docker_run_options ?? ""}
          editable={false}
        />
      </View>
    </>
  );
}
