import { queryClient } from "@/app/_layout";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import {
  Application,
  ApplicationActionResponse,
  ApplicationEnv,
  ApplicationLogs,
  CreateApplicationEnvBody,
  CreateApplicationEnvResponse,
  UpdateApplicationBody,
} from "./types/application.types";
import {
  ResourceActionResponse,
  ResourceUpdateResponse,
} from "./types/resources.types";

type QueryKey = string | number;

export const getApplications = (
  options?: Omit<
    UseQueryOptions<Application[], Error, Application[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications"],
  queryFn: async () => {
    const applications = await coolifyFetch<Application[]>("/applications");

    applications.forEach((application) => {
      queryClient.setQueryData(["applications", application.uuid], application);
    });

    return applications;
  },
});

export const getApplication = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Application, Error, Application, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications", uuid],
  queryFn: () => coolifyFetch<Application>(`/applications/${uuid}`),
});

export const getApplicationLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<
    UseQueryOptions<ApplicationLogs, Error, ApplicationLogs, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications", "logs", uuid, lines],
  queryFn: () =>
    coolifyFetch<ApplicationLogs>(`/applications/${uuid}/logs?lines=${lines}`),
});

export const getApplicationEnvs = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<ApplicationEnv[], Error, ApplicationEnv[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications", "envs", uuid],
  queryFn: () => coolifyFetch<ApplicationEnv[]>(`/applications/${uuid}/envs`),
});

export const createApplicationEnv = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<
      CreateApplicationEnvResponse,
      Error,
      CreateApplicationEnvBody
    >,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications", "envs", "create", uuid],
  mutationFn: async (body: CreateApplicationEnvBody) => {
    const data = await coolifyFetch<CreateApplicationEnvResponse>(
      `/applications/${uuid}/envs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    if ("message" in data) {
      throw data;
    }

    queryClient.setQueryData(
      ["applications", "envs", uuid],
      (old: ApplicationEnv[]) => [...old, { ...body, uuid: data.uuid }]
    );

    return data;
  },
});

export const startApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<
      ApplicationActionResponse,
      Error,
      { force?: boolean; instant_deploy?: boolean }
    >,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications", "start", uuid],
  mutationFn: async ({
    force = false,
    instant_deploy = false,
  }: {
    force?: boolean;
    instant_deploy?: boolean;
  }) => {
    const params = new URLSearchParams({
      force: String(force),
      instant_deploy: String(instant_deploy),
    });
    return coolifyFetch<ApplicationActionResponse>(
      `/applications/${uuid}/start?${params.toString()}`,
      {
        method: "POST",
      }
    );
  },
});

export const stopApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications", "stop", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/applications/${uuid}/stop`, {
      method: "POST",
    });
  },
});

export const restartApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ApplicationActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications", "restart", uuid],
  mutationFn: async () => {
    return coolifyFetch<ApplicationActionResponse>(
      `/applications/${uuid}/restart`,
      {
        method: "POST",
      }
    );
  },
});

export const updateApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceUpdateResponse, Error, UpdateApplicationBody>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications", "update", uuid],
  mutationFn: async (body: UpdateApplicationBody) => {
    queryClient.setQueryData(["applications", uuid], (old: Application) => ({
      ...old,
      ...body,
    }));

    return coolifyFetch<ResourceActionResponse>(`/applications/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
    });
  },
});
