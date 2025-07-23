import { queryClient } from "@/app/_layout";
import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { PartialProject, Project } from "./types/project.types";

type QueryKey = string | number;

export const getProjects = (
  options?: Omit<
    UseQueryOptions<PartialProject[], Error, PartialProject[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["projects"],
  queryFn: async () => {
    const data = await coolifyFetch<PartialProject[]>("/projects");
    data.forEach((project) => {
      queryClient.prefetchQuery(getProject(project.uuid));
    });
    return data;
  },
});

export const getProject = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<Project, Error, Project, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["projects", uuid],
  queryFn: () => coolifyFetch<Project>(`/projects/${uuid}`),
});

export const createProject = () => ({
  mutationKey: ["projects", "create"],
  mutationFn: async (data: PartialProject) => {
    const response = await coolifyFetch<Project>("/projects", {
      method: "POST",
      body: data,
    });

    queryClient.prefetchQuery(getProject(response.uuid));
    return response;
  },
});
