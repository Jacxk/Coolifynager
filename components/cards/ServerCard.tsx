import { Server } from "@/api/types/server.types";
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ServerCardProps = {
  server: Server;
};

export function ServerCard({ server }: ServerCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites<typeof server>("uuid");
  const favorite = { ...server, type: "server" };
  return (
    <Link
      href={{
        pathname: "/main/servers/[uuid]",
        params: { uuid: server.uuid, name: server.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{server.name}</CardTitle>
          <CardDescription>{server.description}</CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favorite)}
        >
          <Star
            className={
              isFavorite(server) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
