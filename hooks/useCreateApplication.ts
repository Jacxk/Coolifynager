import { createApplication } from "@/api/application";
import {
  CoolifyApplications,
  CreateApplicationBody,
} from "@/api/types/application.types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";

export const useCreateApplication = <
  B extends CreateApplicationBody,
  T extends CoolifyApplications
>(
  type: T,
  requiredParams: {
    environment_uuid: string;
    server_uuid: string;
    project_uuid: string;
  }
) => {
  const { mutateAsync, ...rest } = useMutation(createApplication<T, B>());

  const handleCreateApplication = (data: B) => {
    toast.promise(
      mutateAsync({
        body: {
          ...data,
          environment_uuid: requiredParams.environment_uuid,
          server_uuid: requiredParams.server_uuid,
          project_uuid: requiredParams.project_uuid,
        },
        type,
      }),
      {
        loading: "Creating application...",
        success: (data) => {
          router.dismissTo({
            pathname: "/main/applications/[uuid]/(tabs)",
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
