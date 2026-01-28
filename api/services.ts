import { queryClient } from "@/app/_layout";
import {
  filterResourceByTeam,
  filterResourcesByTeam,
} from "@/lib/utils";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  coolifyFetch,
  onOptimisticUpdateError,
  optimisticUpdateOne,
} from "./client";
import {
  DeleteResourceParams,
  ResourceActionResponse,
  ResourceCreateResponse,
} from "./types/resources.types";
import {
  CreateServiceBody,
  Service,
  UpdateServiceBody,
} from "./types/services.types";

// Hook return types
export type UseStartService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseStopService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseRestartService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseUpdateService = (
  uuid: string,
  options?: UseMutationOptions<
    ResourceActionResponse,
    Error,
    Partial<UpdateServiceBody>
  >
) => UseMutationResult<
  ResourceActionResponse,
  Error,
  Partial<UpdateServiceBody>
>;

type ServiceLogs = {
  logs: string;
};

// Query keys
export const ServiceKeys = {
  all: ["services"],
  queries: {
    all: () => ServiceKeys.all,
    single: (uuid: string) => [...ServiceKeys.all, uuid],
    logs: (uuid: string, lines: number) => [
      ...ServiceKeys.queries.single(uuid),
      "logs",
      lines,
    ],
  },
  mutations: {
    create: () => [...ServiceKeys.all, "create"],
    start: (uuid: string) => [...ServiceKeys.queries.single(uuid), "start"],
    stop: (uuid: string) => [...ServiceKeys.queries.single(uuid), "stop"],
    restart: (uuid: string) => [...ServiceKeys.queries.single(uuid), "restart"],
    update: (uuid: string) => [...ServiceKeys.queries.single(uuid), "update"],
    delete: (uuid: string) => [...ServiceKeys.queries.single(uuid), "delete"],
  },
};

// Fetch functions
export const getServices = async () => {
  const data = await coolifyFetch<Service[]>("/services");
  const filtered = await filterResourcesByTeam(
    data,
    (service) => service.server.team_id,
  );
  filtered.forEach((service) =>
    optimisticUpdateOne(ServiceKeys.queries.single(service.uuid), service)
  );
  return filtered;
};

export const getService = async (uuid: string) => {
  queryClient.cancelQueries({
    queryKey: ServiceKeys.queries.all(),
    exact: true,
  });
  const service = await coolifyFetch<Service>(`/services/${uuid}`);
  return filterResourceByTeam(service, (s) => s.server.team_id);
};

export const getServiceLogs = async (uuid: string, lines = 100) => {
  return coolifyFetch<ServiceLogs>(`/services/${uuid}/logs?lines=${lines}`);
};

export const startService = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/start`, {
    method: "POST",
  });
};

export const stopService = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/stop`, {
    method: "POST",
  });
};

export const restartService = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/restart`, {
    method: "POST",
  });
};

export const updateService = async (uuid: string, data: UpdateServiceBody) => {
  throw new Error("Not implemented");
  // TODO: Uncomment this when the API is updated
  // return coolifyFetch<ResourceActionResponse>(`/services/${uuid}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: data,
  // });
};

export const createService = async (data: CreateServiceBody) => {
  const response = await coolifyFetch<ResourceCreateResponse>(`/services`, {
    method: "POST",
    body: data,
  });

  queryClient.prefetchQuery({
    queryKey: ServiceKeys.queries.single(response.uuid),
    queryFn: () => getService(response.uuid),
  });

  return response;
};

export const deleteService = async (
  uuid: string,
  data: DeleteResourceParams
) => {
  return coolifyFetch<ResourceActionResponse>(
    `/services/${uuid}?${new URLSearchParams(
      data as unknown as Record<string, string>
    ).toString()}`,
    {
      method: "DELETE",
    }
  );
};

// Query hooks
export const useServices = (
  options?: Omit<UseQueryOptions<Service[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServiceKeys.queries.all(),
    queryFn: getServices,
    ...options,
  });
};

export const useService = (
  uuid: string,
  options?: Omit<UseQueryOptions<Service | null, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServiceKeys.queries.single(uuid),
    queryFn: () => getService(uuid),
    ...options,
  });
};

export const useServiceLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<UseQueryOptions<ServiceLogs, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServiceKeys.queries.logs(uuid, lines),
    queryFn: () => getServiceLogs(uuid, lines),
    ...options,
  });
};

// Mutation hooks
export const useStartService: UseStartService = (uuid: string, options) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.start(uuid),
    mutationFn: () => startService(uuid),
    ...options,
  });
};

export const useStopService: UseStopService = (uuid: string, options) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.stop(uuid),
    mutationFn: () => stopService(uuid),
    ...options,
  });
};

export const useRestartService: UseRestartService = (uuid: string, options) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.restart(uuid),
    mutationFn: () => restartService(uuid),
    ...options,
  });
};

export const useUpdateService: UseUpdateService = (uuid: string, options) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.update(uuid),
    mutationFn: (data) => updateService(uuid, data),
    ...options,
  });
};

export const useCreateService = (
  options?: UseMutationOptions<ResourceCreateResponse, Error, CreateServiceBody>
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.create(),
    mutationFn: createService,
    ...options,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ServiceKeys.queries.all(),
        exact: true,
      });
    },
  });
};

export const useDeleteService = (
  uuid: string,
  options?: UseMutationOptions<
    ResourceActionResponse,
    Error,
    DeleteResourceParams
  >
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.delete(uuid),
    mutationFn: (data) => deleteService(uuid, data),
    ...options,
    onMutate: async () => {
      const queryKey = ServiceKeys.queries.single(uuid);
      const queryKeyAll = ServiceKeys.queries.all();

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKeyAll });

      const previousData = queryClient.getQueryData<Service>(queryKey);
      const previousDataAll = queryClient.getQueryData<Service[]>(queryKeyAll);

      if (previousDataAll) {
        queryClient.setQueryData(
          queryKeyAll,
          previousDataAll.filter((service) => service.uuid !== uuid)
        );
      }

      queryClient.setQueryData(queryKey, undefined);

      return { previousData, queryKey, previousDataAll, queryKeyAll };
    },
    onError: onOptimisticUpdateError,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ServiceKeys.queries.all(),
        exact: true,
      });
    },
  });
};
