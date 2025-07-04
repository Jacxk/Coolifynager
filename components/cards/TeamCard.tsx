import { Team } from "@/api/types/teams.types";
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites<typeof team>("id");
  const favorite = { ...team, type: "team" };
  return (
    <Link
      href={{
        pathname: "/main/teams/[id]",
        params: { id: team.id, name: team.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>{team.description}</CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favorite)}
        >
          <Star
            className={isFavorite(team) ? "text-yellow-500" : "text-foreground"}
          />
        </Button>
      </Card>
    </Link>
  );
}
