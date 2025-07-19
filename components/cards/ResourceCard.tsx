import { ResourceType } from "@/api/types/resources.types";
import { useFavorites } from "@/context/FavoritesContext";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { HealthIndicator } from "../HealthIndicator";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ResourceCardProps = {
  title: string;
  href: LinkProps["href"];
  uuid: string;
  type: ResourceType;
  status?: string | null;
  description?: string | React.ReactNode | null;
  hideFavorite?: boolean;
  serverStatus?: string | null;
};

export function ResourceCard({
  title,
  href,
  uuid,
  type,
  status,
  description,
  hideFavorite = false,
  serverStatus = "running",
}: ResourceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isServerRunning = serverStatus === "running";

  return (
    <Link href={href}>
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className={!isServerRunning ? "text-red-500" : ""}>
            {isServerRunning
              ? description
              : "The underlying server has problems"}
          </CardDescription>
        </CardHeader>
        {status && (
          <HealthIndicator
            status={status}
            className="absolute top-2 left-2"
            iconClassName="size-2"
          />
        )}
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
