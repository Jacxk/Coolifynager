import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApplicationKeys, useApplication } from "./application";
import { coolifyFetch, optimisticUpdate, optimisticUpdateMany } from "./client";
import { DatabaseKeys, useDatabase } from "./databases";
import { useProject } from "./projects";
import { useServer } from "./servers";
import { ServiceKeys, useService } from "./services";
import { useTeam } from "./teams";
import {
  Resource,
  ResourceFromListType,
  ResourceType,
} from "./types/resources.types";

// Query keys
export const ResourceKeys = {
  all: ["resources"],
  queries: {
    all: () => ResourceKeys.all,
    single: (uuid: string) => [...ResourceKeys.all, uuid],
  },
};

const getQueryKeyFromType = (type: ResourceFromListType) => {
  switch (type) {
    case "application":
      return ApplicationKeys.queries.all();
    case "service":
      return ServiceKeys.queries.all();
    default:
      return DatabaseKeys.queries.all();
  }
};

// Fetch functions
export const getResources = async () => {
  const data = await coolifyFetch<Resource[]>("/resources");
  data.forEach((resource) => {
    const key = getQueryKeyFromType(resource.type);

    optimisticUpdate([...key, resource.uuid], resource);
    optimisticUpdateMany(DatabaseKeys.queries.all(), resource);
  });
  return data;
};

// Query hooks
export const useResource = <T extends Resource>(
  uuid: string,
  type: ResourceType,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey">
) => {
  if (!type) {
    throw new Error("Resource type is required");
  }

  switch (type) {
    case "application":
      return useApplication(uuid, options as any);
    case "database":
      return useDatabase(uuid, options as any);
    case "service":
      return useService(uuid, options as any);
    case "project":
      return useProject(uuid, options as any);
    case "server":
      return useServer(uuid, options as any);
    case "team":
      return useTeam(uuid, options as any);
    default:
      throw new Error(`Unknown resource type: ${type}`);
  }
};

export const useResources = (
  type?: ResourceFromListType,
  options?: UseQueryOptions<Resource[], Error>
) => {
  return useQuery({
    queryKey: [...ResourceKeys.queries.all(), type],
    queryFn: getResources,
    ...options,
  });
};
