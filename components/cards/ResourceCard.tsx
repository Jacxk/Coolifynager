import { ResourceType } from "@/api/types/resources.types";
import { useFavorites } from "@/context/FavoritesContext";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ResourceCardProps = {
  title: string;
  href: LinkProps["href"];
  uuid: string;
  type: ResourceType;
  description?: string | null;
  hideFavorite?: boolean;
};

export function ResourceCard({
  title,
  href,
  uuid,
  type,
  description,
  hideFavorite = false,
}: ResourceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Link href={href}>
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
