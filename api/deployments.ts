import { queryClient } from "@/app/_layout";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApplicationKeys } from "./application";
import {
  coolifyFetch,
  optimisticUpdateInsertOneToMany,
  optimisticUpdateOne,
} from "./client";
import { ApplicationDeployment, Deployment } from "./types/deployments.types";

// Query keys
export const DeploymentKeys = {
  all: ["deployments"],
  queries: {
    all: () => DeploymentKeys.all,
    single: (uuid: string) => [...DeploymentKeys.all, uuid],
    logs: (uuid: string) => [...DeploymentKeys.queries.single(uuid), "logs"],
    application: {
      latest: (uuid: string) => [
        ...ApplicationKeys.queries.single(uuid),
        "deployments",
        "latest",
      ],
      list: (uuid: string, pageSize: number) => [
        ...ApplicationKeys.queries.single(uuid),
        "deployments",
        pageSize,
      ],
    },
  },
};

// Fetch functions
export const getDeployments = async () => {
  const data = await coolifyFetch<Deployment[]>("/deployments");
  data.forEach((deployment) =>
    optimisticUpdateOne(
      DeploymentKeys.queries.single(deployment.deployment_uuid),
      deployment
    )
  );
  return data;
};

/**
 * Returns cached data from getDeploymentLogs if available,
 * since the logs are baked into a deployment object
 */
export const getDeployment = async (uuid: string) => {
  const old = queryClient.getQueryData<Deployment>(
    DeploymentKeys.queries.logs(uuid)
  );
  if (old) return old;

  const data = await coolifyFetch<Deployment>(`/deployments/${uuid}`);
  optimisticUpdateOne(DeploymentKeys.queries.logs(uuid), data);
  return data;
};

export const getDeploymentLogs = async (uuid: string) => {
  const data = await coolifyFetch<Deployment>(`/deployments/${uuid}`);

  if (data.status === "in_progress") {
    optimisticUpdateInsertOneToMany(DeploymentKeys.queries.all(), data);
  }

  optimisticUpdateOne(DeploymentKeys.queries.single(uuid), data);

  return data;
};

export const getLatestApplicationDeployment = async (uuid: string) => {
  return coolifyFetch<ApplicationDeployment>(
    `/deployments/applications/${uuid}?skip=0&take=1`
  );
};

export const getApplicationDeployments = async (
  uuid: string,
  pageSize: number,
  pageParam: number
) => {
  const data = await coolifyFetch<ApplicationDeployment>(
    `/deployments/applications/${uuid}?skip=${pageParam}&take=${pageSize}`
  );
  data.deployments.forEach((deployment) => {
    optimisticUpdateOne(
      DeploymentKeys.queries.single(deployment.deployment_uuid),
      deployment
    );
    optimisticUpdateOne(
      DeploymentKeys.queries.logs(deployment.deployment_uuid),
      deployment
    );

    if (deployment.status === "in_progress") {
      optimisticUpdateInsertOneToMany(DeploymentKeys.queries.all(), deployment);
    }
  });
  return data;
};

// Query hooks
export const useDeployments = (
  options?: Omit<UseQueryOptions<Deployment[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DeploymentKeys.queries.all(),
    queryFn: getDeployments,
    ...options,
  });
};

export const useDeployment = (
  uuid: string,
  options?: Omit<UseQueryOptions<Deployment, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DeploymentKeys.queries.single(uuid),
    queryFn: () => getDeployment(uuid),
    ...options,
  });
};

export const useDeploymentLogs = (
  uuid: string,
  options?: Omit<UseQueryOptions<Deployment, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DeploymentKeys.queries.logs(uuid),
    queryFn: () => getDeploymentLogs(uuid),
    ...options,
  });
};

export const useLatestApplicationDeployment = (
  uuid: string,
  options?: Omit<UseQueryOptions<ApplicationDeployment, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DeploymentKeys.queries.application.latest(uuid),
    queryFn: () => getLatestApplicationDeployment(uuid),
    ...options,
  });
};

export const useApplicationDeployments = (
  uuid: string,
  pageSize = 5,
  options?: Omit<
    UseInfiniteQueryOptions<
      ApplicationDeployment,
      Error,
      InfiniteData<ApplicationDeployment>,
      unknown[],
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return useInfiniteQuery({
    queryKey: DeploymentKeys.queries.application.list(uuid, pageSize),
    queryFn: ({ pageParam = 0 }) =>
      getApplicationDeployments(uuid, pageSize, pageParam),
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
    ...options,
  });
};
