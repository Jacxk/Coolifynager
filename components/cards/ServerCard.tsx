import { getServer } from "@/api/servers";
import { Server } from "@/api/types/server.types";
import { FavoriteResource, useFavorites } from "@/hooks/useFavorites";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ServerCardProps = {
  server: Server;
};

export function ServerCard({ server }: ServerCardProps) {
  const isFocused = useIsFocused();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteData: FavoriteResource = {
    uuid: server.uuid,
    type: "server",
  };

  const { data } = useQuery(
    getServer(server.uuid, {
      enabled: (!server.name || !server.description) && isFocused,
    })
  );

  return (
    <Link
      href={{
        pathname: "/main/servers/[uuid]",
        params: { uuid: server.uuid, name: server.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{server.name ?? data?.name}</CardTitle>
          <CardDescription>
            {server.description ?? data?.description}
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
