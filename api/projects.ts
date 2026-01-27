import { queryClient } from "@/app/_layout";
import {
  filterResourceByTeam,
  filterResourcesByTeam,
} from "@/lib/utils";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { coolifyFetch, onOptimisticUpdateError } from "./client";
import {
  PartialProject,
  Project,
  ProjectCreateBody,
} from "./types/project.types";
import {
  ResourceActionResponse,
  ResourceCreateResponse,
} from "./types/resources.types";

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
  
  // Check if team_id exists in the response (API might return it even if type doesn't)
  const hasTeamId = data.length > 0 && 'team_id' in data[0];
  
  let filtered: PartialProject[];
  if (hasTeamId) {
    // Filter directly if team_id is present
    filtered = await filterResourcesByTeam(
      data,
      (project) => (project as PartialProject & { team_id?: number }).team_id,
    );
  } else {
    // If team_id is not in the list response, fetch full projects to filter
    // This is less efficient but necessary if API doesn't return team_id in list
    const projectsWithTeam = await Promise.all(
      data.map(async (project) => {
        try {
          const fullProject = await getProject(project.uuid);
          return fullProject;
        } catch {
          return null;
        }
      })
    );
    const validProjects = projectsWithTeam.filter(
      (p): p is Project => p !== null
    );
    const filteredProjects = await filterResourcesByTeam(
      validProjects,
      (project) => project.team_id,
    );
    // Convert back to PartialProject format
    filtered = filteredProjects.map(({ team_id, created_at, updated_at, environments, ...rest }) => rest);
  }
  
  filtered.forEach((project) => {
    queryClient.prefetchQuery({
      queryKey: ProjectKeys.queries.single(project.uuid),
      queryFn: () => getProject(project.uuid),
    });
  });
  return filtered;
};

export const getProject = async (uuid: string) => {
  const project = await coolifyFetch<Project>(`/projects/${uuid}`);
  return filterResourceByTeam(project, (p) => p.team_id);
};

export const createProject = async (data: ProjectCreateBody) => {
  const res = await coolifyFetch<ResourceCreateResponse>("/projects", {
    method: "POST",
    body: data,
  });

  queryClient.prefetchQuery({
    queryKey: ProjectKeys.queries.single(res.uuid),
    queryFn: () => getProject(res.uuid),
  });
  return res;
};

export const deleteProject = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/projects/${uuid}`, {
    method: "DELETE",
  });
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
  options?: Omit<UseQueryOptions<Project | null, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ProjectKeys.queries.single(uuid),
    queryFn: () => getProject(uuid),
    ...options,
  });
};

// Mutation hooks
export const useCreateProject = (
  options?: UseMutationOptions<ResourceCreateResponse, Error, ProjectCreateBody>
) => {
  return useMutation({
    mutationKey: ProjectKeys.mutations.create(),
    mutationFn: createProject,
    ...options,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ProjectKeys.queries.all(),
        exact: true,
      });
    },
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
    onMutate: async () => {
      const queryKey = ProjectKeys.queries.single(uuid);
      const previousData = queryClient.getQueryData<Project[]>(queryKey);

      queryClient.setQueryData(queryKey, undefined);

      return { previousData, queryKey };
    },
    onError: onOptimisticUpdateError,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ProjectKeys.queries.all(),
        exact: true,
      });
    },
  });
};
