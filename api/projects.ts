import { queryClient } from "@/app/_layout";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { coolifyFetch, optimisticUpdateInsertOneToMany } from "./client";
import { PartialProject, Project } from "./types/project.types";
import { ResourceActionResponse } from "./types/resources.types";

// Query keys
export const ProjectKeys = {
  all: ["projects"],
  queries: {
    all: () => ProjectKeys.all,
    single: (uuid: string) => [...ProjectKeys.all, uuid],
  },
  mutations: {
    create: () => [...ProjectKeys.all, "create"],
    delete: (uuid: string) => [...ProjectKeys.queries.single(uuid), "delete"],
  },
};

// Fetch functions
export const getProjects = async () => {
  const data = await coolifyFetch<PartialProject[]>("/projects");
  data.forEach((project) => {
    queryClient.prefetchQuery({
      queryKey: ProjectKeys.queries.single(project.uuid),
      queryFn: () => getProject(project.uuid),
    });
  });
  return data;
};

export const getProject = async (uuid: string) => {
  return coolifyFetch<Project>(`/projects/${uuid}`);
};

export const createProject = async (data: PartialProject) => {
  const response = await coolifyFetch<Project>("/projects", {
    method: "POST",
    body: data,
  });

  queryClient.prefetchQuery({
    queryKey: ProjectKeys.queries.single(response.uuid),
    queryFn: () =>
      getProject(response.uuid).then((project) =>
        optimisticUpdateInsertOneToMany(ProjectKeys.queries.all(), project)
      ),
  });
  return response;
};

export const deleteProject = async (uuid: string) => {
  const response = await coolifyFetch<ResourceActionResponse>(
    `/projects/${uuid}`,
    {
      method: "DELETE",
    }
  );

  queryClient.invalidateQueries({
    queryKey: ProjectKeys.queries.all(),
  });

  return response;
};

// Query hooks
export const useProjects = (
  options?: Omit<UseQueryOptions<PartialProject[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ProjectKeys.queries.all(),
    queryFn: getProjects,
    ...options,
  });
};

export const useProject = (
  uuid: string,
  options?: Omit<UseQueryOptions<Project, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ProjectKeys.queries.single(uuid),
    queryFn: () => getProject(uuid),
    ...options,
  });
};

// Mutation hooks
export const useCreateProject = (
  options?: UseMutationOptions<Project, Error, PartialProject>
) => {
  return useMutation({
    mutationKey: ProjectKeys.mutations.create(),
    mutationFn: (data: PartialProject) => createProject(data),
    ...options,
  });
};

export const useDeleteProject = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => {
  return useMutation({
    mutationKey: ProjectKeys.mutations.delete(uuid),
    mutationFn: () => deleteProject(uuid),
    ...options,
  });
};
