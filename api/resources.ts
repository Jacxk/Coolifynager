import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Resource } from "./types/resources.types";

type QueryKey = string | number;

export const getResources = (
  options?: Omit<
    UseQueryOptions<Resource[], Error, Resource[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["resources"],
  queryFn: () => coolifyFetch<Resource[]>("/resources"),
});
