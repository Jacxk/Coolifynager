import { coolifyFetch } from "./client";
import { Team } from "./types/teams.types";

export const getTeams = {
  queryKey: ["teams"],
  queryFn: (): Promise<Team[]> => coolifyFetch("/teams"),
};

export const getTeam = (id: string) => ({
  queryKey: ["teams", id],
  queryFn: (): Promise<Team> => coolifyFetch(`/teams/${id}`),
});
