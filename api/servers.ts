import { coolifyFetch } from "./client";
import { Server } from "./types/server.types";

export const getServers = {
  queryKey: ["servers"],
  queryFn: (): Promise<Server[]> => coolifyFetch("/servers"),
};

export const getServer = (uuid: string) => ({
  queryKey: ["servers", uuid],
  queryFn: (): Promise<Server> => coolifyFetch(`/servers/${uuid}`),
});
