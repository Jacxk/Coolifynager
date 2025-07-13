import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { ResourceActionResponse } from "./types/resources.types";
import {
  Service,
  SingleService,
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
  queryFn: () => coolifyFetch<Service[]>("/services"),
});

export const getService = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<SingleService, Error, SingleService, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services", uuid],
  queryFn: () => coolifyFetch<SingleService>(`/services/${uuid}`),
});

export const startService = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["services.start", uuid],
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
  mutationKey: ["services.stop", uuid],
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
  mutationKey: ["services.restart", uuid],
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
  queryKey: ["services.logs", uuid, lines],
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
  mutationKey: ["services.update", uuid],
  mutationFn: async (data: Partial<UpdateServiceBody>) => {
    return coolifyFetch<ResourceActionResponse>(`/services/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
  },
});
