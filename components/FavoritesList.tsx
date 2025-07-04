import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ServerCard } from "@/components/cards/ServerCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { TeamCard } from "@/components/cards/TeamCard";
import { Text } from "@/components/ui/text";
import { useFavorites } from "@/hooks/useFavorites";
import { View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { H2 } from "./ui/typography";

export function FavoritesList() {
  const { favorites } = useFavorites<any>("uuid");

  if (!favorites.length) {
    return (
      <Text className="text-muted-foreground">
        There is nothing in favorites.
      </Text>
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
            <AccordionContent>
              {grouped[type].map((favorite) => {
                switch (type) {
                  case "application":
                    return (
                      <ApplicationCard key={favorite.uuid} {...favorite} />
                    );
                  case "project":
                    return (
                      <ProjectCard key={favorite.uuid} project={favorite} />
                    );
                  case "server":
                    return <ServerCard key={favorite.uuid} server={favorite} />;
                  case "team":
                    return <TeamCard key={favorite.id} team={favorite} />;
                  case "service":
                    return (
                      <ServiceCard key={favorite.uuid} service={favorite} />
                    );
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
