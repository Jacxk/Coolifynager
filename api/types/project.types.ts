export type Project = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  environments: [
    {
      id: number;
      name: string;
      project_id: number;
      created_at: string;
      updated_at: string;
      description: string;
    }
  ];
};
