import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Server } from "./types/server.types";

type QueryKey = string | number;

export const getServers = (
  options?: Omit<
    UseQueryOptions<Server[], Error, Server[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["servers"],
  queryFn: (): Promise<Server[]> => coolifyFetch("/servers"),
});

export const getServer = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Server, Error, Server, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["servers", uuid],
  queryFn: (): Promise<Server> => coolifyFetch(`/servers/${uuid}`),
});
