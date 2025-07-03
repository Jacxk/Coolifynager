import { coolifyFetch } from "./client";
import {
  Application,
  ApplicationEnv,
  ApplicationLogs,
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
