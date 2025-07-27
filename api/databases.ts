import { queryClient } from "@/app/_layout";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { coolifyFetch, optimisticUpdate, optimisticUpdateMany } from "./client";
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

// Hook return types
export type UseStartDatabase = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseStopDatabase = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseRestartDatabase = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseUpdateDatabase = (
  uuid: string,
  options?: UseMutationOptions<
    ResourceActionResponse,
    Error,
    UpdateDatabaseBody
  >
) => UseMutationResult<ResourceActionResponse, Error, UpdateDatabaseBody>;

type DatabaseLogs = {
  logs: string;
};

// Query keys
export const DatabaseKeys = {
  all: ["databases"],
  queries: {
    all: () => DatabaseKeys.all,
    single: (uuid: string) => [...DatabaseKeys.all, uuid],
    logs: (uuid: string, lines: number) => [
      ...DatabaseKeys.queries.single(uuid),
      "logs",
      lines,
    ],
  },
  mutations: {
    create: () => [...DatabaseKeys.all, "create"],
    start: (uuid: string) => [...DatabaseKeys.queries.single(uuid), "start"],
    stop: (uuid: string) => [...DatabaseKeys.queries.single(uuid), "stop"],
    restart: (uuid: string) => [
      ...DatabaseKeys.queries.single(uuid),
      "restart",
    ],
    update: (uuid: string) => [...DatabaseKeys.queries.single(uuid), "update"],
  },
};

// Fetch functions
export const getDatabases = async () => {
  const data = await coolifyFetch<Database[]>("/databases");
  // Set individual database cache entries
  data.forEach((database) => {
    queryClient.setQueryData(
      DatabaseKeys.queries.single(database.uuid),
      database
    );
  });

  return data;
};

export const getDatabase = async (uuid: string) => {
  const data = await coolifyFetch<Database>(`/databases/${uuid}`);
  // Update the databases list cache with the new database
  optimisticUpdateMany(DatabaseKeys.queries.all(), data);
  return data;
};

export const getDatabaseLogs = async (uuid: string, lines = 100) => {
  return coolifyFetch<DatabaseLogs>(`/databases/${uuid}/logs?lines=${lines}`);
};

export const startDatabase = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/start`, {
    method: "POST",
  });
};

export const stopDatabase = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/stop`, {
    method: "POST",
  });
};

export const restartDatabase = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}/restart`, {
    method: "POST",
  });
};

export const updateDatabase = async (
  uuid: string,
  data: UpdateDatabaseBody
) => {
  // Update individual database cache
  optimisticUpdate(DatabaseKeys.queries.single(uuid), data);

  // Update databases list cache
  optimisticUpdateMany(DatabaseKeys.queries.all(), { ...data, uuid });

  return coolifyFetch<ResourceActionResponse>(`/databases/${uuid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
};

export const createDatabase = async (
  body: CreateDatabaseBody,
  type: CoolifyDatabases
) => {
  const response = await coolifyFetch<ResourceCreateResponse>(
    `/databases/${type}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
  );

  // Invalidate the databases list cache to refetch with the new database
  queryClient.invalidateQueries({ queryKey: DatabaseKeys.queries.all() });

  return response;
};

// Query hooks
export const useDatabases = (
  options?: Omit<UseQueryOptions<Database[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DatabaseKeys.queries.all(),
    queryFn: getDatabases,
    ...options,
  });
};

export const useDatabase = (
  uuid: string,
  options?: Omit<UseQueryOptions<Database, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DatabaseKeys.queries.single(uuid),
    queryFn: () => getDatabase(uuid),
    ...options,
  });
};

export const useDatabaseLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<UseQueryOptions<DatabaseLogs, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: DatabaseKeys.queries.logs(uuid, lines),
    queryFn: () => getDatabaseLogs(uuid, lines),
    ...options,
  });
};

// Mutation hooks
export const useStartDatabase: UseStartDatabase = (uuid: string, options) => {
  return useMutation({
    mutationKey: DatabaseKeys.mutations.start(uuid),
    mutationFn: () => startDatabase(uuid),
    ...options,
  });
};

export const useStopDatabase: UseStopDatabase = (uuid: string, options) => {
  return useMutation({
    mutationKey: DatabaseKeys.mutations.stop(uuid),
    mutationFn: () => stopDatabase(uuid),
    ...options,
  });
};

export const useRestartDatabase: UseRestartDatabase = (
  uuid: string,
  options
) => {
  return useMutation({
    mutationKey: DatabaseKeys.mutations.restart(uuid),
    mutationFn: () => restartDatabase(uuid),
    ...options,
  });
};

export const useUpdateDatabase: UseUpdateDatabase = (uuid: string, options) => {
  return useMutation({
    mutationKey: DatabaseKeys.mutations.update(uuid),
    mutationFn: (data: UpdateDatabaseBody) => updateDatabase(uuid, data),
    ...options,
  });
};

export const useCreateDatabase = (
  options?: UseMutationOptions<
    ResourceCreateResponse,
    Error,
    { body: CreateDatabaseBody; type: CoolifyDatabases }
  >
) => {
  return useMutation({
    mutationKey: DatabaseKeys.mutations.create(),
    mutationFn: ({
      body,
      type,
    }: {
      body: CreateDatabaseBody;
      type: CoolifyDatabases;
    }) => createDatabase(body, type),
    ...options,
  });
};
