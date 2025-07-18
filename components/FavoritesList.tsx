import { getApplication } from "@/api/application";
import { getDatabase } from "@/api/databases";
import { getProject } from "@/api/projects";
import { getServer } from "@/api/servers";
import { getService } from "@/api/services";
import { getTeam } from "@/api/teams";
import { ResourceType } from "@/api/types/resources.types";
import { Text } from "@/components/ui/text";
import { useFavorites } from "@/context/FavoritesContext";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";
import { LinkProps } from "expo-router";
import { View } from "react-native";
import { ResourceCard } from "./cards/ResourceCard";
import { SkeletonCard } from "./skeletons/SkeletonCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { H2 } from "./ui/typography";

const getHref = (
  type: ResourceType,
  uuid: string,
  name: string
): LinkProps["href"] => {
  switch (type) {
    case "application":
      return {
        pathname: "/main/applications/[uuid]/(tabs)",
        params: { uuid, name },
      };
    case "service":
      return {
        pathname: "/main/services/[uuid]/(tabs)",
        params: { uuid, name },
      };
    case "database":
      return {
        pathname: "/main/databases/[uuid]/(tabs)",
        params: { uuid, name },
      };
    case "project":
      return {
        pathname: "/main/projects/[uuid]",
        params: { uuid, name },
      };
    case "server":
      return {
        pathname: "/main/servers/[uuid]",
        params: { uuid, name },
      };
    case "team":
      return {
        pathname: "/main/teams/[id]",
        params: { id: uuid },
      };
  }
};

type ResourceData = {
  uuid: string;
  name: string;
  description: string | null;
  status: string;
};

export function FavoritesList() {
  const { favorites } = useFavorites();

  const { data, pending } = useQueries({
    queries: favorites.map((favorite) => {
      switch (favorite.type) {
        case "application":
          return getApplication(favorite.uuid);
        case "service":
          return getService(favorite.uuid);
        case "database":
          return getDatabase(favorite.uuid);
        case "project":
          return getProject(favorite.uuid);
        case "server":
          return getServer(favorite.uuid);
        case "team":
          return getTeam(favorite.uuid);
        default:
          return {
            queryKey: ["disabled", favorite.uuid],
            queryFn: () => Promise.resolve(null),
            enabled: false,
          } as UseQueryOptions<any, Error, any, any>;
      }
    }),
    combine: (results) => {
      return {
        data: results.map((result, index) => {
          const resourceData = result.data;
          return {
            uuid: resourceData?.uuid || favorites[index]?.uuid,
            name: resourceData?.name || "Unknown",
            description: resourceData?.description || resourceData?.status,
            status: resourceData?.status,
            type:
              favorites.filter((f) => f.uuid === resourceData?.uuid)[0]?.type ||
              "disabled",
          } as ResourceData & { type: ResourceType };
        }),
        pending: results.some((result) => result.isPending),
      };
    },
  });

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

  if (pending) {
    return (
      <View>
        <H2>Favorites</H2>
        <View className="flex gap-2">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  const grouped = data.reduce(
    (acc: Record<string, (ResourceData & { type: ResourceType })[]>, item) => {
      if (item && item.type) {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
      }
      return acc;
    },
    {}
  );

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
              {grouped[type].map((item) => (
                <ResourceCard
                  key={item.uuid}
                  uuid={item.uuid}
                  title={item.name}
                  description={item.description}
                  status={item.status}
                  type={item.type}
                  href={getHref(item.type, item.uuid, item.name)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}
