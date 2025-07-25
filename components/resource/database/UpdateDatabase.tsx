import { updateDatabase } from "@/api/databases";
import {
  CoolifyDatabaseType,
  Database,
  UpdateDatabaseBody,
  isClickHouseDatabase,
  isDragonFlyDatabase,
  isKeyDBDatabase,
  isMariaDBDatabase,
  isMongoDBDatabase,
  isMySQLDatabase,
  isPostgreSQLDatabase,
  isRedisDatabase,
} from "@/api/types/database.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useEditing } from "@/context/EditingContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useMutation } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import AdvancedSection from "./AdvancedSection";
import GeneralSection from "./general/GeneralSection";
import InitializationScriptsSection from "./InitializationScriptsSection";
import NetworkSection from "./NetworkSection";
import ProxySection from "./ProxySection";
import SslConfiguration from "./SslConfigurationSection";

const getInitialValues = (data: Database): UpdateDatabaseBody => {
  const baseValues = {
    image: data.image,
    is_public: data.is_public,
    public_port: data.public_port,
  };

  if (isPostgreSQLDatabase(data)) {
    return {
      ...baseValues,
      postgres_user: data.postgres_user,
      postgres_password: data.postgres_password,
      postgres_db: data.postgres_db,
      postgres_initdb_args: data.postgres_initdb_args,
      postgres_host_auth_method: data.postgres_host_auth_method,
      postgres_conf: data.postgres_conf,
    };
  }

  if (isMySQLDatabase(data)) {
    return {
      ...baseValues,
      mysql_root_password: data.mysql_root_password,
      mysql_password: data.mysql_password,
      mysql_user: data.mysql_user,
      mysql_database: data.mysql_database,
      mysql_conf: data.mysql_conf,
    };
  }

  if (isMariaDBDatabase(data)) {
    return {
      ...baseValues,
      mariadb_conf: data.mariadb_conf,
      mariadb_root_password: data.mariadb_root_password,
      mariadb_user: data.mariadb_user,
      mariadb_password: data.mariadb_password,
      mariadb_database: data.mariadb_database,
    };
  }

  if (isMongoDBDatabase(data)) {
    return {
      ...baseValues,
      mongo_conf: data.mongo_conf,
      mongo_initdb_root_username: data.mongo_initdb_root_username,
      mongo_initdb_root_password: data.mongo_initdb_root_password,
      mongo_initdb_database: data.mongo_initdb_database,
    };
  }

  if (isRedisDatabase(data)) {
    return {
      ...baseValues,
      redis_password: data.redis_password,
      redis_conf: data.redis_conf,
    };
  }

  if (isDragonFlyDatabase(data)) {
    return {
      ...baseValues,
      dragonfly_password: data.dragonfly_password,
    };
  }

  if (isKeyDBDatabase(data)) {
    return {
      ...baseValues,
      keydb_password: data.keydb_password,
      keydb_conf: data.keydb_conf,
    };
  }

  if (isClickHouseDatabase(data)) {
    return {
      ...baseValues,
      clickhouse_admin_user: data.clickhouse_admin_user,
      clickhouse_admin_password: data.clickhouse_admin_password,
    };
  }

  return baseValues;
};

export default function UpdateDatabase({ data }: { data: Database }) {
  const { setIsEditing } = useEditing();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateDatabaseBody>({
    values: getInitialValues(data),
  });
  const { mutateAsync: saveChanges } = useMutation(updateDatabase(data.uuid));

  const handleSave = (formData: UpdateDatabaseBody) => {
    // Handle database-specific data processing
    let processedData = { ...formData };

    if (isPostgreSQLDatabase(data) && "postgres_conf" in formData) {
      processedData = {
        ...processedData,
        postgres_conf: Buffer.from(
          formData.postgres_conf ?? "",
          "utf-8"
        ).toString("base64"),
      };
    }

    toast.promise(saveChanges(processedData), {
      loading: "Saving changes...",
      success: () => {
        reset((data) => data, {
          keepDirtyValues: true,
        });
        setIsEditing(false);
        return "Changes saved successfully!";
      },
      error: (err: unknown) => {
        console.log(err);
        return (err as ResourceHttpError).message ?? "Failed to save changes.";
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  useUnsavedChanges({
    isDirty: Object.keys(dirtyFields).length > 0,
    onSave: handleSubmit(handleSave),
    onCancel: handleCancel,
    onOpen: () => setIsEditing(true),
    onClose: () => setIsEditing(false),
    onLostFocus: () => setIsEditing(false),
    onFocus: reset,
  });

  const databaseType = isKeyDBDatabase(data)
    ? CoolifyDatabaseType.KEYDB
    : data.database_type;

  return (
    <View className="gap-2">
      <GeneralSection control={control} errors={errors} database={data} />
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
          value={data.custom_docker_run_options ?? ""}
          editable={false}
        />
      </View>
      <NetworkSection
        ports_mappings={data.ports_mappings}
        internal_db_url={data.internal_db_url}
        external_db_url={data.external_db_url}
        is_public={data.is_public}
        database_type={databaseType}
      />
      <SslConfiguration
        enable_ssl={data.enable_ssl}
        ssl_mode={data.ssl_mode}
        database_type={databaseType}
      />
      <ProxySection control={control} database={data} />
      <AdvancedSection is_log_drain_enabled={data.is_log_drain_enabled} />

      {isPostgreSQLDatabase(data) && (
        <InitializationScriptsSection init_scripts={data.init_scripts} />
      )}
    </View>
  );
}
