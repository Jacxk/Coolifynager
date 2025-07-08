import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type ServiceCardProps = {
  uuid: string;
  name: string;
  status?: string;
  description?: string;
  service_type?: string;
};

export function ServiceCard({
  uuid,
  name,
  description,
  status,
  service_type,
}: ServiceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites<ServiceCardProps>("uuid");
  const favorite = {
    uuid,
    name,
    description,
    status,
    service_type,
    type: "service",
  };

  return (
    <Link
      href={{
        pathname: "/main/services/[uuid]/(tabs)",
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
