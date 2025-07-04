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

export const getApplications = {
  queryKey: ["applications"],
  queryFn: (): Promise<Application[]> => coolifyFetch("/applications"),
};

export const getApplication = (uuid: string) => ({
  queryKey: ["applications", uuid],
  queryFn: (): Promise<Application> => coolifyFetch(`/applications/${uuid}`),
});

export const getApplicationLogs = (uuid: string, lines = 100) => ({
  queryKey: ["applications.logs", uuid, lines],
  queryFn: (): Promise<ApplicationLogs> =>
    coolifyFetch(`/applications/${uuid}/logs?lines=${lines}`),
});

export const getApplicationEnvs = (uuid: string) => ({
  queryKey: ["applications.envs", uuid],
  queryFn: (): Promise<ApplicationEnv[]> =>
    coolifyFetch(`/applications/${uuid}/envs`),
});

export const createApplicationEnv = (uuid: string) => ({
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

export const startApplication = (uuid: string) => ({
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

export const stopApplication = (uuid: string) => ({
  mutationKey: ["applications.stop", uuid],
  mutationFn: async (): Promise<ApplicationStopResponse> => {
    return coolifyFetch(`/applications/${uuid}/stop`, {
      method: "POST",
    });
  },
});

export const restartApplication = (uuid: string) => ({
  mutationKey: ["applications.restart", uuid],
  mutationFn: async (): Promise<ApplicationRestartResponse> => {
    return coolifyFetch(`/applications/${uuid}/restart`, {
      method: "POST",
    });
  },
});
