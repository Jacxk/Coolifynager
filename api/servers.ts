import { queryClient } from "@/app/_layout";
import {
  filterResourceByTeam,
  filterResourcesByTeam,
} from "@/lib/utils";
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
  const filtered = await filterResourcesByTeam(
    data,
    (server) => server.team_id ?? undefined,
  );
  filtered.forEach((server) => {
    queryClient.setQueryData(ServerKeys.queries.single(server.uuid), server);
  });
  return filtered;
};

export const getServer = async (uuid: string) => {
  const server = await coolifyFetch<SingleServer>(`/servers/${uuid}`);
  return filterResourceByTeam(server, (s) => s.team_id);
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
  options?: Omit<UseQueryOptions<SingleServer | null, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ServerKeys.queries.single(uuid),
    queryFn: () => getServer(uuid),
    ...options,
  });
};
