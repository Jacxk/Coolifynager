import { queryClient } from "@/app/_layout";
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
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
  queryFn: async () => {
    const data = await coolifyFetch<Deployment[]>("/deployments");
    data.forEach((deployment) => {
      queryClient.setQueryData(
        ["deployments", deployment.deployment_uuid],
        deployment
      );
    });
    return data;
  },
});

// Returns cached data from getDeploymentLogs if available,
// since the logs are baked into a deployment object
export const getDeployment = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Deployment, Error, Deployment, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["deployments", uuid],
  queryFn: async () => {
    const old = queryClient.getQueryData<Deployment>([
      "deployments",
      "logs",
      uuid,
    ]);
    if (old) return old;

    const data = await coolifyFetch<Deployment>(`/deployments/${uuid}`);
    queryClient.setQueryData(["deployments", "logs", uuid], data);
    return data;
  },
});

export const getDeploymentLogs = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Deployment, Error, Deployment, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["deployments", "logs", uuid],
  queryFn: async () => {
    const data = await coolifyFetch<Deployment>(`/deployments/${uuid}`);
    queryClient.setQueryData(["deployments", uuid], data);

    return data;
  },
});

export const getLatestApplicationDeployment = (
  uuid: string,
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
  queryKey: ["applications", "deployments", "latest", uuid],
  queryFn: () =>
    coolifyFetch<ApplicationDeployment>(
      `/deployments/applications/${uuid}?skip=0&take=1`
    ),
});

export const getApplicationDeployments = (
  uuid: string,
  pageSize = 5,
  options?: Omit<
    UseInfiniteQueryOptions<
      ApplicationDeployment,
      Error,
      InfiniteData<ApplicationDeployment>,
      QueryKey[],
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => ({
  ...options,
  queryKey: ["application", "deployments", uuid, pageSize],
  queryFn: async ({ pageParam = 0 }) =>
    coolifyFetch<ApplicationDeployment>(
      `/deployments/applications/${uuid}?skip=${pageParam}&take=${pageSize}`
    ),
  getNextPageParam: (
    lastPage: ApplicationDeployment,
    _: unknown,
    lastPageParam: number
  ) => {
    if (lastPage.count < pageSize) return undefined;

    if (lastPage.deployments.length === 0) {
      return undefined;
    }
    return lastPageParam + pageSize;
  },
  initialPageParam: 0,
});
