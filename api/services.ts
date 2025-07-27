import { queryClient } from "@/app/_layout";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { coolifyFetch, optimisticUpdate, optimisticUpdateMany } from "./client";
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
  data.forEach((service) => {
    queryClient.setQueryData(ServiceKeys.queries.single(service.uuid), service);
  });
  return data;
};

export const getService = async (uuid: string) => {
  const data = await coolifyFetch<Service>(`/services/${uuid}`);
  // Update the services list cache with the new service
  optimisticUpdateMany(ServiceKeys.all, data);
  return data;
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
  // Update individual service cache
  optimisticUpdate(ServiceKeys.queries.single(uuid), data);

  // Update services list cache
  optimisticUpdateMany(ServiceKeys.all, { ...data, uuid });

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

  if ("uuid" in response) {
    queryClient.prefetchQuery({
      queryKey: ServiceKeys.queries.single(response.uuid),
      queryFn: () => getService(response.uuid),
    });
  }

  return response;
};

export const deleteService = async (
  uuid: string,
  data: DeleteResourceParams
) => {
  queryClient.removeQueries({
    queryKey: ServiceKeys.queries.single(uuid),
    exact: true,
  });

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
  options?: Omit<UseQueryOptions<Service, Error>, "queryKey">
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
export const useStartService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.start(uuid),
    mutationFn: () => startService(uuid),
    ...options,
  });
};

export const useStopService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.stop(uuid),
    mutationFn: () => stopService(uuid),
    ...options,
  });
};

export const useRestartService = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.restart(uuid),
    mutationFn: () => restartService(uuid),
    ...options,
  });
};

export const useUpdateService = (
  uuid: string,
  options?: UseMutationOptions<
    ResourceActionResponse,
    Error,
    Partial<UpdateServiceBody>
  >
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.update(uuid),
    mutationFn: (data: UpdateServiceBody) => updateService(uuid, data),
    ...options,
  });
};

export const useCreateService = (
  options?: UseMutationOptions<ResourceCreateResponse, Error, CreateServiceBody>
) => {
  return useMutation({
    mutationKey: ServiceKeys.mutations.create(),
    mutationFn: (data: CreateServiceBody) => createService(data),
    ...options,
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
    mutationFn: (data: DeleteResourceParams) => deleteService(uuid, data),
    ...options,
  });
};
