import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Service } from "./types/services.types";

type QueryKey = string | number;

export const getServices = (
  options?: Omit<
    UseQueryOptions<Service[], Error, Service[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services"],
  queryFn: (): Promise<Service[]> => coolifyFetch("/services"),
});

export const getService = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Service, Error, Service, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services", uuid],
  queryFn: (): Promise<Service> => coolifyFetch(`/services/${uuid}`),
});
