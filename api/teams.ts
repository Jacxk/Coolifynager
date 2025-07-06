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
  queryFn: (): Promise<Team[]> => coolifyFetch("/teams"),
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
  queryFn: (): Promise<Team> => coolifyFetch(`/teams/${id}`),
});
