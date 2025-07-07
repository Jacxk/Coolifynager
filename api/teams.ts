import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { Team } from "./types/teams.types";

type QueryKey = string | number;

export const getTeams = (
  options?: Omit<
    UseQueryOptions<Team[], Error, Team[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["teams"],
  queryFn: () => coolifyFetch<Team[]>("/teams"),
});

export const getTeam = (
  id: string,
  options?: Omit<
    UseQueryOptions<Team, Error, Team, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["teams", id],
  queryFn: () => coolifyFetch<Team>(`/teams/${id}`),
});
