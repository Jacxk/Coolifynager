export type ProjectEnvironment = {
  id: number;
  uuid: string;
  name: string;
  project_id: number;
  created_at: string;
  updated_at: string;
  description: string;
};

export type ProjectBase = {
  id: number;
  uuid: string;
  name: string;
  description: string;
};

export type Project = ProjectBase;

export type SingleProject = ProjectBase & {
  team_id: number;
  created_at: string;
  updated_at: string;
  environments: ProjectEnvironment[];
};
