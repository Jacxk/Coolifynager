import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Text } from "@/components/ui/text";
import { FavoriteResource, useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { DatabaseCard } from "./cards/DatabaseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { H2 } from "./ui/typography";

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteResource[]>([]);
  const { getFavorites } = useFavorites();

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, [getFavorites]);

  if (!favorites.length) {
    return (
      <View>
        <H2>Favorites</H2>
        <Text className="text-muted-foreground">
          There is nothing in favorites.
        </Text>
      </View>
    );
  }

  const grouped = favorites.reduce((acc: Record<string, any[]>, fav: any) => {
    if (!acc[fav.type]) acc[fav.type] = [];
    acc[fav.type].push(fav);
    return acc;
  }, {});

  const typeOrder = [
    { type: "application", label: "Applications" },
    { type: "project", label: "Projects" },
    { type: "server", label: "Servers" },
    { type: "team", label: "Teams" },
    { type: "service", label: "Services" },
    { type: "database", label: "Databases" },
  ];

  const presentTypes = typeOrder.filter(({ type }) => grouped[type]);
  const defaultValue = presentTypes.map(({ type }) => type);

  return (
    <View className="flex gap-4">
      <H2>Favorites</H2>
      <Accordion type="multiple" defaultValue={defaultValue}>
        {presentTypes.map(({ type, label }) => (
          <AccordionItem className="border-0" key={type} value={type}>
            <AccordionTrigger>
              <Text>{label}</Text>
            </AccordionTrigger>
            <AccordionContent className="gap-2">
              {grouped[type].map((favorite) => {
                switch (type as FavoriteResource["type"]) {
                  case "application":
                    return (
                      <ApplicationCard key={favorite.uuid} {...favorite} />
                    );
                  case "project":
                    return (
                      <ProjectCard key={favorite.uuid} project={favorite} />
                    );
                  case "service":
                    return <ServiceCard key={favorite.uuid} {...favorite} />;
                  case "database":
                    return <DatabaseCard key={favorite.uuid} {...favorite} />;
                  default:
                    return null;
                }
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}
