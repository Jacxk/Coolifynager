import { Application } from "@/api/types/application.types";
import { Database } from "@/api/types/database.types";
import { SingleProject } from "@/api/types/project.types";
import { ResourceType } from "@/api/types/resources.types";
import { SingleServer } from "@/api/types/server.types";
import { SingleService } from "@/api/types/services.types";
import { Team } from "@/api/types/teams.types";
import { useFavorites } from "@/context/FavoritesContext";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { Star } from "../icons/Star";
import { SkeletonCard } from "../skeletons/SkeletonCard";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type QueryKey = string | number;

type ResourceCardBaseProps = {
  uuid: string;
  hideFavorite?: boolean;
};

export function ResourceCard(
  props: ResourceCardBaseProps & {
    type: "project";
    getResource: (
      uuid: string,
      options?: any
    ) => {
      queryKey: QueryKey[];
      queryFn: () => Promise<SingleProject>;
      [key: string]: any;
    };
  }
): React.JSX.Element;

export function ResourceCard(
  props: ResourceCardBaseProps & {
    type: "service";
    getResource: (
      uuid: string,
      options?: any
    ) => {
      queryKey: QueryKey[];
      queryFn: () => Promise<SingleService>;
      [key: string]: any;
    };
  }
): React.JSX.Element;

export function ResourceCard(props: {
  uuid: string;
  type: "application";
  hideFavorite?: boolean;
  getResource: (
    uuid: string,
    options?: any
  ) => {
    queryKey: QueryKey[];
    queryFn: () => Promise<Application>;
    [key: string]: any;
  };
}): React.JSX.Element;

export function ResourceCard(
  props: ResourceCardBaseProps & {
    type: "database";
    getResource: (
      uuid: string,
      options?: any
    ) => {
      queryKey: QueryKey[];
      queryFn: () => Promise<Database>;
      [key: string]: any;
    };
  }
): React.JSX.Element;

export function ResourceCard(
  props: ResourceCardBaseProps & {
    type: "server";
    getResource: (
      uuid: string,
      options?: any
    ) => {
      queryKey: QueryKey[];
      queryFn: () => Promise<SingleServer>;
      [key: string]: any;
    };
  }
): React.JSX.Element;

export function ResourceCard(
  props: ResourceCardBaseProps & {
    type: "team";
    getResource: (
      uuid: string,
      options?: any
    ) => {
      queryKey: QueryKey[];
      queryFn: () => Promise<Team>;
      [key: string]: any;
    };
  }
): React.JSX.Element;

export function ResourceCard({
  uuid,
  type,
  getResource,
  hideFavorite = false,
}: ResourceCardBaseProps & {
  type: ResourceType;
  getResource: (uuid: string, options?: any) => any;
}) {
  const isFocused = useIsFocused();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isPending } = useQuery(
    getResource(uuid, { enabled: isFocused })
  );

  if (isPending) return <SkeletonCard />;
  if (!data) return null;

  const getHref = (): LinkProps["href"] => {
    switch (type) {
      case "project":
        const project = data as SingleProject;
        return {
          pathname: "/main/projects/[uuid]",
          params: {
            uuid: project.uuid,
            name: project.name,
            environments:
              project.environments?.map((env) => `${env.uuid}:${env.name}`) ||
              [],
          },
        };
      case "service":
        const service = data as SingleService;
        return {
          pathname: "/main/services/[uuid]/(tabs)",
          params: { uuid, name: service.name },
        };
      case "application":
        const app = data as Application;
        return {
          pathname: "/main/applications/[uuid]/(tabs)",
          params: { uuid, name: app.name },
        };
      case "database":
        const db = data as Database;
        return {
          pathname: "/main/databases/[uuid]/(tabs)",
          params: { uuid, name: db.name },
        };
      case "server":
        const server = data as SingleServer;
        return {
          pathname: "/main/servers/[uuid]",
          params: { uuid, name: server.name },
        };
      case "team":
        const team = data as Team;
        return {
          pathname: "/main/teams/[id]",
          params: { id: team.id },
        };
      default:
        return "/main";
    }
  };

  const getName = () => {
    switch (type) {
      case "project":
        const project = data as SingleProject;
        return project.name;
      case "service":
        const service = data as SingleService;
        return service.name;
      case "application":
        const app = data as Application;
        return app.name;
      case "database":
        const db = data as Database;
        return db.name;
      case "server":
        const server = data as SingleServer;
        return server.name;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "project":
        const project = data as SingleProject;
        return project.description;
      case "service":
        const service = data as SingleService;
        return service.description || service.status;
      case "application":
        const app = data as Application;
        return app.description || app.status;
      case "database":
        const db = data as Database;
        return db.description || db.status;
      case "server":
        const server = data as SingleServer;
        return server.description;
    }
  };

  return (
    <Link href={getHref()}>
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{getName()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        {!hideFavorite && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4"
            onPress={() => toggleFavorite({ uuid, type })}
          >
            <Star
              className={
                isFavorite(uuid) ? "text-yellow-500" : "text-foreground"
              }
            />
          </Button>
        )}
      </Card>
    </Link>
  );
}
