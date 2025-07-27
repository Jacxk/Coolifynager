import { queryClient } from "@/app/_layout";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Database } from "./types/database.types";
import { Resource, ResourceFromListType } from "./types/resources.types";

// Query keys
export const ResourceKeys = {
  all: ["resources"],
  queries: {
    all: () => ResourceKeys.all,
    single: (uuid: string) => [...ResourceKeys.all, uuid],
  },
};

const getQueryKeyFromType = (type: ResourceFromListType) => {
  if (type !== "application" && type !== "service") {
    return "database";
  }
  return type;
};

// Fetch functions
export const getResources = async () => {
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
};

// Query hooks
export const useResources = (options?: UseQueryOptions<Resource[], Error>) => {
  return useQuery({
    queryKey: ResourceKeys.all,
    queryFn: getResources,
    ...options,
  });
};
