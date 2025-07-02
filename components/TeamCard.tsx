import { Team } from "@/api/types/teams.types";
import { Link } from "expo-router";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href={{
        pathname: "/main/teams/[id]",
        params: { id: team.id, name: team.name },
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>{team.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
