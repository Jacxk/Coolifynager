import { useCreateApplication } from "@/api/application";
import {
  CoolifyApplications,
  CreateApplicationBody,
  CreateApplicationBodyRequired,
} from "@/api/types/application.types";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";

export const useCreateApplicationHandler = <B extends CreateApplicationBody>(
  type: CoolifyApplications,
  routerPath?: "applications" | "services" | "databases"
) => {
  const { environment_uuid, server_uuid, project_uuid } =
    useLocalSearchParams<CreateApplicationBodyRequired>();

  const { mutateAsync, ...rest } = useCreateApplication<
    CoolifyApplications,
    B & CreateApplicationBodyRequired
  >();

  const handleCreateApplication = (data: B) => {
    toast.promise(
      mutateAsync({
        body: {
          ...data,
          environment_uuid,
          server_uuid,
          project_uuid,
        },
        type,
      }),
      {
        loading: "Creating application...",
        success: (data) => {
          router.dismissTo({
            pathname: `/main/${routerPath ?? "applications"}/[uuid]/(tabs)`,
            params: {
              uuid: data.uuid,
            },
          });
          return "Application created successfully";
        },
        error: (err) => {
          console.info(err);
          return "Failed to create application";
        },
      }
    );
  };

  return { handleCreateApplication, ...rest };
};
