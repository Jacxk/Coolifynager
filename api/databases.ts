import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Database, UpdateDatabaseBody } from "./types/database.types";
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

type DatabaseLogs = {
  logs: string;
};

export const getDatabaseLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<
    UseQueryOptions<DatabaseLogs, Error, DatabaseLogs, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["databases.logs", uuid, lines],
  queryFn: () =>
    coolifyFetch<DatabaseLogs>(`/databases/${uuid}/logs?lines=${lines}`),
});

export const updateDatabase = (
  uuid: string,
  options?: Omit<
    UseMutationOptions<ResourceActionResponse, Error, UpdateDatabaseBody>,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["databases.update", uuid],
  mutationFn: async (data: UpdateDatabaseBody) => {
    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
  },
});
