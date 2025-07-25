import { createApplication } from "@/api/application";
import {
  CoolifyApplications,
  CreateApplicationBody,
  CreateApplicationBodyRequired,
} from "@/api/types/application.types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";

export const useCreateApplication = <B extends CreateApplicationBody>(
  type: CoolifyApplications,
  requiredParams: CreateApplicationBodyRequired,
  routerPath?: "applications" | "services" | "databases"
) => {
  const { mutateAsync, ...rest } = useMutation(
    createApplication<CoolifyApplications, B & CreateApplicationBodyRequired>()
  );

  const handleCreateApplication = (data: B) => {
    toast.promise(
      mutateAsync({
        body: {
          ...data,
          ...requiredParams,
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
