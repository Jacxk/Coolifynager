import { coolifyFetch } from "./client";
import { Application } from "./types";

export const getApplications = {
  queryKey: ["applications.list"],
  queryFn: (): Promise<Application[]> => coolifyFetch("/applications"),
};
