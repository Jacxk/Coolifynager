import { queryClient } from "@/app/_layout";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
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

type QueryKey = string | number;

export const getServices = (
  options?: Omit<
    UseQueryOptions<Service[], Error, Service[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services"],
  queryFn: async () => {
    const data = await coolifyFetch<Service[]>("/services");
    data.forEach((service) => {
      queryClient.setQueryData(["services", service.uuid], service);
    });
    return data;
  },
});

export const getService = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Service, Error, Service, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services", uuid],
  queryFn: () => coolifyFetch<Service>(`/services/${uuid}`),
});

export const startService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "start", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/start`, {
      method: "POST",
    });
  },
});

export const stopService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "stop", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/stop`, {
      method: "POST",
    });
  },
});

export const restartService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "restart", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/services/${uuid}/restart`, {
      method: "POST",
    });
  },
});

type ServiceLogs = {
  logs: string;
};

export const getServiceLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<
    UseQueryOptions<ServiceLogs, Error, ServiceLogs, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services", "logs", uuid, lines],
  queryFn: () =>
    coolifyFetch<ServiceLogs>(`/services/${uuid}/logs?lines=${lines}`),
});

export const updateService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<
      ResourceActionResponse,
      Error,
      Partial<UpdateServiceBody>
    >,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "update", uuid],
  mutationFn: async (data: UpdateServiceBody) => {
    throw new Error("Not implemented");
    // TODO: Uncomment this when the API is updated
    // return coolifyFetch<ResourceActionResponse>(`/services/${uuid}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: data,
    // });
  },
});

export const createService = (
  options?: Omit<
    UseMutationOptions<ResourceCreateResponse, Error, CreateServiceBody>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "create"],
  mutationFn: async (data: CreateServiceBody) => {
    const response = await coolifyFetch<ResourceCreateResponse>(`/services`, {
      method: "POST",
      body: data,
    });

    if ("uuid" in response) {
      queryClient.prefetchQuery(getService(response.uuid));
    }

    return response;
  },
});

export const deleteService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, DeleteResourceParams>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services", "delete", uuid],
  mutationFn: (data: DeleteResourceParams) => {
    queryClient.removeQueries({ queryKey: ["services", uuid], exact: true });

    return coolifyFetch<ResourceActionResponse>(
      `/services/${uuid}?${new URLSearchParams(
        data as unknown as Record<string, string>
      ).toString()}`,
      {
        method: "DELETE",
      }
    );
  },
});
