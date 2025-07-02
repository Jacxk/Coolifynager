import { coolifyFetch } from "./client";
import { Project } from "./types/project.types";

export const getProjects = {
  queryKey: ["projects"],
  queryFn: (): Promise<Project[]> => coolifyFetch("/projects"),
};

export const getProject = (uuid: string) => ({
  queryKey: ["projects", uuid],
  queryFn: (): Promise<Project> => coolifyFetch(`/projects/${uuid}`),
});
