import { useFavorites } from "@/hooks/useFavorites";
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
  const { isFavorite, toggleFavorite } =
    useFavorites<ApplicationCardProps>("uuid");
  const favorite = {
    uuid,
    name,
    description,
    status,
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
          <CardTitle>{name}</CardTitle>
          <CardDescription>{status?.split(":")[1]}</CardDescription>
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
