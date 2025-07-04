import { Service } from "@/api/types/services.types";
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites<typeof service>("uuid");
  const favorite = { ...service, type: "service" };
  return (
    <Link
      href={{
        pathname: "/main/services/[uuid]",
        params: { uuid: service.uuid, name: service.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favorite)}
        >
          <Star
            className={
              isFavorite(service) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
