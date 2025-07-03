import { coolifyFetch } from "./client";
import { Application, ApplicationLogs } from "./types/application.types";

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

export type ApplicationEnv = {
  id: number;
  uuid: string;
  resourceable_type: string;
  resourceable_id: number;
  is_build_time: boolean;
  is_literal: boolean;
  is_multiline: boolean;
  is_preview: boolean;
  is_shared: boolean;
  is_shown_once: boolean;
  key: string;
  value: string;
  real_value: string;
  version: string;
  created_at: string;
  updated_at: string;
};

export const getApplicationEnvs = (uuid: string) => ({
  queryKey: ["applications.envs", uuid],
  queryFn: (): Promise<ApplicationEnv[]> =>
    coolifyFetch(`/applications/${uuid}/envs`),
});
