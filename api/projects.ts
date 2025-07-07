import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Project, SingleProject } from "./types/project.types";

type QueryKey = string | number;

export const getProjects = (
  options?: Omit<
    UseQueryOptions<Project[], Error, Project[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["projects"],
  queryFn: () => coolifyFetch<Project[]>("/projects"),
});

export const getProject = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<SingleProject, Error, SingleProject, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["projects", uuid],
  queryFn: () => coolifyFetch<SingleProject>(`/projects/${uuid}`),
});
