import { queryClient } from "@/app/_layout";
import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Resource, ResourceFromListType } from "./types/resources.types";

type QueryKey = string | number;

const getQueryKeyFromType = (type: ResourceFromListType) => {
  if (type !== "application" && type !== "service") {
    return "database";
  }
  return type;
};

export const getResources = (
  options?: Omit<
    UseQueryOptions<Resource[], Error, Resource[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["resources"],
  queryFn: async () => {
    const data = await coolifyFetch<Resource[]>("/resources");
    data.forEach((resource) => {
      const queryKey = [getQueryKeyFromType(resource.type), resource.uuid];
      queryClient.setQueryData(queryKey, resource);
    });
    return data;
  },
});
