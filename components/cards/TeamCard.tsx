import { getTeam } from "@/api/teams";
import { Team } from "@/api/types/teams.types";
import { FavoriteResource, useFavorites } from "@/hooks/useFavorites";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  const isFocused = useIsFocused();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteData: FavoriteResource = {
    uuid: team.id.toString(),
    type: "team",
  };

  const { data } = useQuery(
    getTeam(team.id.toString(), {
      enabled: (!team.name || !team.description) && isFocused,
    })
  );

  return (
    <Link
      href={{
        pathname: "/main/teams/[id]",
        params: { id: team.id, name: team.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{team.name ?? data?.name}</CardTitle>
          <CardDescription>
            {team.description ?? data?.description}
          </CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favoriteData)}
        >
          <Star
            className={
              isFavorite(favoriteData) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
