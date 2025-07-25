import { queryClient } from "@/app/_layout";
import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Database } from "./types/database.types";
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
      const type = getQueryKeyFromType(resource.type);
      const queryKey = [type, resource.uuid];
      queryClient.setQueryData(queryKey, resource);

      if (type === "database") {
        queryClient.setQueryData(["databases"], (old: Database[]) => {
          const index = old.findIndex((db) => db.uuid === resource.uuid);
          if (index === -1) {
            return [...old, resource];
          }
          return old;
        });
      }
    });
    return data;
  },
});
