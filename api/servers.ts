import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Server, SingleServer } from "./types/server.types";

type QueryKey = string | number;

export const getServers = (
  options?: Omit<
    UseQueryOptions<Server[], Error, Server[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["servers"],
  queryFn: () => coolifyFetch<Server[]>("/servers"),
});

export const getServer = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<SingleServer, Error, SingleServer, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["servers", uuid],
  queryFn: () => coolifyFetch<SingleServer>(`/servers/${uuid}`),
});
