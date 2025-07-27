import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Team } from "./types/teams.types";

// Query keys
export const TeamKeys = {
  all: ["teams"],
  queries: {
    all: () => TeamKeys.all,
    single: (uuid: string) => [...TeamKeys.all, uuid],
  },
};

// Fetch functions
export const getTeams = async () => {
  return coolifyFetch<Team[]>("/teams");
};

export const getTeam = async (id: string) => {
  return coolifyFetch<Team>(`/teams/${id}`);
};

// Query hooks
export const useTeams = (
  options?: Omit<UseQueryOptions<Team[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: TeamKeys.all,
    queryFn: getTeams,
    ...options,
  });
};

export const useTeam = (
  id: string,
  options?: Omit<UseQueryOptions<Team, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: TeamKeys.queries.single(id),
    queryFn: () => getTeam(id),
    ...options,
  });
};
