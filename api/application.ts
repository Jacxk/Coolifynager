import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import {
  Application,
  ApplicationEnv,
  ApplicationLogs,
  ApplicationRestartResponse,
  ApplicationStartResponse,
  ApplicationStopResponse,
  CreateApplicationEnvBody,
  CreateApplicationEnvResponse,
} from "./types/application.types";

type QueryKey = string | number;

export const getApplications = (
  options?: Omit<
    UseQueryOptions<Application[], Error, Application[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications"],
  queryFn: (): Promise<Application[]> => coolifyFetch("/applications"),
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
  queryFn: (): Promise<Application> => coolifyFetch(`/applications/${uuid}`),
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
  queryKey: ["applications.logs", uuid, lines],
  queryFn: (): Promise<ApplicationLogs> =>
    coolifyFetch(`/applications/${uuid}/logs?lines=${lines}`),
});

export const getApplicationEnvs = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<ApplicationEnv[], Error, ApplicationEnv[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["applications.envs", uuid],
  queryFn: (): Promise<ApplicationEnv[]> =>
    coolifyFetch(`/applications/${uuid}/envs`),
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
  mutationKey: ["applications.envs.create", uuid],
  mutationFn: async (
    body: CreateApplicationEnvBody
  ): Promise<CreateApplicationEnvResponse> => {
    return coolifyFetch(`/applications/${uuid}/envs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },
});

export const startApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<
      ApplicationStartResponse,
      Error,
      { force?: boolean; instant_deploy?: boolean }
    >,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications.start", uuid],
  mutationFn: async ({
    force = false,
    instant_deploy = false,
  }: {
    force?: boolean;
    instant_deploy?: boolean;
  }): Promise<ApplicationStartResponse> => {
    const params = new URLSearchParams({
      force: String(force),
      instant_deploy: String(instant_deploy),
    });
    return coolifyFetch(`/applications/${uuid}/start?${params.toString()}`, {
      method: "POST",
    });
  },
});

export const stopApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ApplicationStopResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications.stop", uuid],
  mutationFn: async (): Promise<ApplicationStopResponse> => {
    return coolifyFetch(`/applications/${uuid}/stop`, {
      method: "POST",
    });
  },
});

export const restartApplication = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ApplicationRestartResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["applications.restart", uuid],
  mutationFn: async (): Promise<ApplicationRestartResponse> => {
    return coolifyFetch(`/applications/${uuid}/restart`, {
      method: "POST",
    });
  },
});
