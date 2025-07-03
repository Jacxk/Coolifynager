import { coolifyFetch } from "./client";
import { ApplicationDeployment, Deployment } from "./types/deployments.types";

export const getDeployments = {
  queryKey: ["deployments"],
  queryFn: (): Promise<Deployment[]> => coolifyFetch("/deployments"),
};

export const getDeployment = (uuid: string) => ({
  queryKey: ["deployments", uuid],
  queryFn: (): Promise<Deployment> => coolifyFetch(`/deployments/${uuid}`),
});

export const getApplicationDeployments = (
  uuid: string,
  skip = 0,
  take = 10
) => ({
  queryKey: ["application.deployments", uuid, skip, take],
  queryFn: (): Promise<ApplicationDeployment> =>
    coolifyFetch(`/deployments/applications/${uuid}?skip=${skip}&take=${take}`),
});
