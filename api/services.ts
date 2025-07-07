import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Service, SingleService } from "./types/services.types";

type QueryKey = string | number;

export const getServices = (
  options?: Omit<
    UseQueryOptions<Service[], Error, Service[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services"],
  queryFn: () => coolifyFetch<Service[]>("/services"),
});

export const getService = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<SingleService, Error, SingleService, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["services", uuid],
  queryFn: () => coolifyFetch<SingleService>(`/services/${uuid}`),
});
