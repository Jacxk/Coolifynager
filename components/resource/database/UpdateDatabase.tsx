import { updateDatabase } from "@/api/databases";
import { Database, UpdateDatabaseBody } from "@/api/types/database.types";
import { ResourceHttpError } from "@/api/types/resources.types";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import GeneralSection from "./GeneralSection";
import NetworkSection from "./NetworkSection";

const getInitialValues = (data: Database): UpdateDatabaseBody => ({
  name: data.name,
  description: data.description,
  image: data.image,
  is_public: data.is_public,
  public_port: data.public_port,
  limits_memory: data.limits_memory,
  limits_memory_swap: data.limits_memory_swap,
  limits_memory_swappiness: data.limits_memory_swappiness,
  limits_memory_reservation: data.limits_memory_reservation,
  limits_cpus: data.limits_cpus,
  limits_cpuset: data.limits_cpuset,
  limits_cpu_shares: data.limits_cpu_shares,
  postgres_user: data.postgres_user,
  postgres_password: data.postgres_password,
  postgres_db: data.postgres_db,
  postgres_initdb_args: data.postgres_initdb_args,
  postgres_host_auth_method: data.postgres_host_auth_method,
  postgres_conf: data.postgres_conf,
  ports_mappings: data.ports_mappings,
});

export default function UpdateService({
  data,
  setIsEditing,
}: {
  data: Database;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<UpdateDatabaseBody>({
    values: getInitialValues(data),
  });
  const { mutateAsync: saveChanges } = useMutation(updateDatabase(data.uuid));

  const handleSave = (data: UpdateDatabaseBody) => {
    toast.promise(saveChanges(data), {
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
    isDirty,
    onSave: handleSubmit(handleSave),
    onCancel: handleCancel,
    onOpen: () => setIsEditing(true),
    onClose: () => setIsEditing(false),
    onLostFocus: () => setIsEditing(false),
    onFocus: reset,
  });

  return (
    <View className="gap-2">
      <GeneralSection control={control} errors={errors} />
      <NetworkSection
        control={control}
        internal_db_url={data.internal_db_url}
      />
    </View>
  );
}
