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
