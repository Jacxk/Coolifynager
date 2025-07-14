import { getApplication } from "@/api/application";
import { FavoriteResource, useFavorites } from "@/hooks/useFavorites";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type ApplicationCardProps = {
  uuid: string;
  name: string;
  status?: string;
  description?: string;
};

export function ApplicationCard({
  uuid,
  name,
  description,
  status,
}: ApplicationCardProps) {
  const isFocused = useIsFocused();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data } = useQuery(
    getApplication(uuid, {
      enabled: (!name || !description || !status) && isFocused,
    })
  );
  const favoriteData: FavoriteResource = {
    uuid,
    type: "application",
  };

  return (
    <Link
      href={{
        pathname: "/main/applications/[uuid]",
        params: { uuid: uuid, name: name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{name ?? data?.name}</CardTitle>
          <CardDescription>
            {status ?? description ?? data?.description ?? data?.status}
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
