import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Database } from "./types/database.types";
import { ResourceActionResponse } from "./types/resources.types";

type QueryKey = string | number;

export const getDatabases = (
  options?: Omit<
    UseQueryOptions<Database[], Error, Database[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["databases"],
  queryFn: () => coolifyFetch<Database[]>("/databases"),
});

export const getDatabase = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Database, Error, Database, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["databases", uuid],
  queryFn: () => coolifyFetch<Database>(`/databases/${uuid}`),
});

export const startDatabase = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["databases.start", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/start`, {
      method: "POST",
    });
  },
});

export const stopDatabase = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["databases.stop", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/stop`, {
      method: "POST",
    });
  },
});

export const restartDatabase = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["databases.restart", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/restart`, {
      method: "POST",
    });
  },
});
