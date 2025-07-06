import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { ApplicationDeployment, Deployment } from "./types/deployments.types";

type QueryKey = string | number;

export const getDeployments = (
  options?: Omit<
    UseQueryOptions<Deployment[], Error, Deployment[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["deployments"],
  queryFn: (): Promise<Deployment[]> => coolifyFetch("/deployments"),
});

export const getDeployment = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Deployment, Error, Deployment, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["deployments", uuid],
  queryFn: (): Promise<Deployment> => coolifyFetch(`/deployments/${uuid}`),
});

export const getApplicationDeployments = (
  uuid: string,
  skip = 0,
  take = 10,
  options?: Omit<
    UseQueryOptions<
      ApplicationDeployment,
      Error,
      ApplicationDeployment,
      QueryKey[]
    >,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["application.deployments", uuid, skip, take],
  queryFn: (): Promise<ApplicationDeployment> =>
    coolifyFetch(`/deployments/applications/${uuid}?skip=${skip}&take=${take}`),
});
