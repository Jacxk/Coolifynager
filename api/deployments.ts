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
  queryFn: () => coolifyFetch<Deployment[]>("/deployments"),
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
  queryFn: () => coolifyFetch<Deployment>(`/deployments/${uuid}`),
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
