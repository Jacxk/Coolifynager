import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type DatabaseCardProps = {
  uuid: string;
  name: string;
  status?: string;
  description?: string;
  database_type?: string;
};

export function DatabaseCard({
  uuid,
  name,
  description,
  status,
  database_type,
}: DatabaseCardProps) {
  const { isFavorite, toggleFavorite } =
    useFavorites<DatabaseCardProps>("uuid");
  const favorite = {
    uuid,
    name,
    description,
    status,
    database_type,
    type: "database",
  };

  return (
    <Link
      href={{
        pathname: "/main/databases/[uuid]/(tabs)",
        params: { uuid: uuid, name: name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{status || description}</CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favorite)}
        >
          <Star
            className={
              isFavorite(favorite) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
