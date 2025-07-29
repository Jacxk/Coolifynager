import { queryClient } from "@/app/_layout";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Server, SingleServer } from "./types/server.types";

// Query keys
export const ServerKeys = {
  all: ["servers"],
  queries: {
    all: () => ServerKeys.all,
    single: (uuid: string) => [...ServerKeys.all, uuid],
  },
};

// Fetch functions
export const getServers = async () => {
  const data = await coolifyFetch<Server[]>("/servers");
  data.forEach((server) => {
    queryClient.setQueryData(ServerKeys.queries.single(server.uuid), server);
  });
  return data;
};

export const getServer = async (uuid: string) => {
  return coolifyFetch<SingleServer>(`/servers/${uuid}`);
};

// Query hooks
export const useServers = (
  options?: Omit<UseQueryOptions<Server[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServerKeys.queries.all(),
    queryFn: getServers,
    ...options,
  });
};

export const useServer = (
  uuid: string,
  options?: Omit<UseQueryOptions<SingleServer, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServerKeys.queries.single(uuid),
    queryFn: () => getServer(uuid),
    ...options,
  });
};
