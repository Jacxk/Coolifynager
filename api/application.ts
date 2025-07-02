import { coolifyFetch } from "./client";
import { Application, ApplicationLogs } from "./types/application.types";

export const getApplications = {
  queryKey: ["applications.list"],
  queryFn: (): Promise<Application[]> => coolifyFetch("/applications"),
};

export const getApplication = (uuid: string) => ({
  queryKey: [`applications.${uuid}`],
  queryFn: (): Promise<Application> => coolifyFetch(`/applications/${uuid}`),
});

export const getApplicationLogs = (uuid: string) => ({
  queryKey: [`applications.${uuid}.logs`],
  queryFn: (): Promise<ApplicationLogs> =>
    coolifyFetch(`/applications/${uuid}/logs`),
});
