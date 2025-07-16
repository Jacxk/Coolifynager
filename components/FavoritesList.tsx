import { getApplication } from "@/api/application";
import { getDatabase } from "@/api/databases";
import { getProject } from "@/api/projects";
import { getServer } from "@/api/servers";
import { getService } from "@/api/services";
import { ResourceType } from "@/api/types/resources.types";
import { Text } from "@/components/ui/text";
import { useFavorites } from "@/context/FavoritesContext";
import { View } from "react-native";
import { ResourceCard } from "./cards/ResourceCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { H2 } from "./ui/typography";

function FavoriteCard({ uuid, type }: { uuid: string; type: ResourceType }) {
  switch (type) {
    case "application":
      return (
        <ResourceCard
          uuid={uuid}
          type="application"
          getResource={getApplication}
        />
      );
    case "project":
      return (
        <ResourceCard uuid={uuid} type="project" getResource={getProject} />
      );
    case "service":
      return (
        <ResourceCard uuid={uuid} type="service" getResource={getService} />
      );
    case "database":
      return (
        <ResourceCard uuid={uuid} type="database" getResource={getDatabase} />
      );
    case "server":
      return <ResourceCard uuid={uuid} type="server" getResource={getServer} />;
  }
}

export function FavoritesList() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
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
              {grouped[type].map((favorite) => (
                <FavoriteCard
                  key={favorite.uuid}
                  uuid={favorite.uuid}
                  type={type as ResourceType}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}
