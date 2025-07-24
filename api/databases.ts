import { queryClient } from "@/app/_layout";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import {
  CoolifyDatabases,
  CreateDatabaseBody,
  Database,
  UpdateDatabaseBody,
} from "./types/database.types";
import {
  ResourceActionResponse,
  ResourceCreateResponse,
} from "./types/resources.types";

type QueryKey = string | number;

export const getDatabases = (
  options?: Omit<
    UseQueryOptions<Database[], Error, Database[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["databases"],
  queryFn: async () => {
    const data = await coolifyFetch<Database[]>("/databases");
    data.forEach((database) => {
      queryClient.setQueryData(["databases", database.uuid], database);
    });
    return data;
  },
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
  mutationKey: ["databases", "start", uuid],
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
  mutationKey: ["databases", "stop", uuid],
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
  mutationKey: ["databases", "restart", uuid],
  mutationFn: async () => {
    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/restart`, {
      method: "POST",
    });
  },
});

type DatabaseLogs = {
  logs: string;
};

// TODO: Implement logs fetching (api is not implemented yet)
export const getDatabaseLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<
    UseQueryOptions<DatabaseLogs, Error, DatabaseLogs, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["databases", "logs", uuid, lines],
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
  mutationKey: ["databases", "update", uuid],
  mutationFn: (data: UpdateDatabaseBody) => {
    queryClient.setQueryData(["databases", uuid], data);

    return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
  },
});

export const createDatabase = (
  options?: Omit<
    UseMutationOptions<
      ResourceCreateResponse,
      Error,
      { body: CreateDatabaseBody; type: CoolifyDatabases }
    >,
    "mutationKey" | "mutationFn"
  >
) => ({
  ...options,
  mutationKey: ["databases", "create"],
  mutationFn: async ({
    body,
    type,
  }: {
    body: CreateDatabaseBody;
    type: CoolifyDatabases;
  }) => {
    return coolifyFetch<ResourceCreateResponse>(`/databases/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  },
});
