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
  onOptimisticUpdateSettled,
  optimisticUpdateInsertOneToMany,
  optimisticUpdateOne,
} from "./client";
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
/**
 * This function sets the cache for the databases and returns the cache
 * since not all databases are returned from the api. They can be get from
 * getResources and the cache is filled from that.
 */
export const getDatabases = async () => {
  const data = await coolifyFetch<Database[]>("/databases");
  const filtered = await filterResourcesByTeam(
    data,
    (db) => db.destination.server.team_id,
  );
  // Set individual database cache entries
  filtered.forEach((database) => {
    optimisticUpdateInsertOneToMany(DatabaseKeys.queries.all(), database);
    optimisticUpdateOne(DatabaseKeys.queries.single(database.uuid), database);
  });

  return (queryClient.getQueryData(DatabaseKeys.queries.all()) ||
    []) as Database[];
};

export const getDatabase = async (uuid: string) => {
  const data = await coolifyFetch<Database>(`/databases/${uuid}`);
  const filtered = await filterResourceByTeam(
    data,
    (db) => db.destination.server.team_id,
  );
  if (filtered) {
    // Update the databases list cache with the new database
    optimisticUpdateInsertOneToMany(DatabaseKeys.queries.all(), filtered);
  }
  return filtered;
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
  const res = await coolifyFetch<ResourceCreateResponse>(`/databases/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  queryClient.prefetchQuery({
    queryKey: DatabaseKeys.queries.single(res.uuid),
    queryFn: () => getDatabase(res.uuid),
  });

  return res;
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
  options?: Omit<UseQueryOptions<Database | null, Error>, "queryKey">
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
    onMutate: async (data) => {
      const update = await optimisticUpdateOne(
        DatabaseKeys.queries.single(uuid),
        data
      );
      const insert = await optimisticUpdateInsertOneToMany(
        DatabaseKeys.queries.all(),
        {
          ...data,
          uuid,
        }
      );
      await options?.onMutate?.(data);
      return { update, insert };
    },
    onError: (error, variables, context) => {
      if (context) {
        onOptimisticUpdateError(error, variables, context.update);
        onOptimisticUpdateError(error, variables, context.insert);
      }
    },
    onSettled: onOptimisticUpdateSettled(DatabaseKeys.queries.all()),
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
    onSettled: onOptimisticUpdateSettled(DatabaseKeys.queries.all()),
  });
};
