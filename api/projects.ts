import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Project } from "./types/project.types";

type QueryKey = string | number;

export const getProjects = (
  options?: Omit<
    UseQueryOptions<Project[], Error, Project[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["projects"],
  queryFn: (): Promise<Project[]> => coolifyFetch("/projects"),
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
  queryFn: (): Promise<Project> => coolifyFetch(`/projects/${uuid}`),
});
