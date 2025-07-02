import { coolifyFetch } from "./client";
import { Service } from "./types/services.types";

export const getServices = {
  queryKey: ["services"],
  queryFn: (): Promise<Service[]> => coolifyFetch("/services"),
};

export const getService = (uuid: string) => ({
  queryKey: ["services", uuid],
  queryFn: (): Promise<Service> => coolifyFetch(`/services/${uuid}`),
});
