import { ResourceType } from "@/api/types/resources.types";
import { useFavorites } from "@/context/FavoritesContext";
import { LinkProps, router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { HealthIndicator } from "../HealthIndicator";
import { Star } from "../icons/Star";
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

  const cardTap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => {
      router.push(href);
    });

  return (
    <GestureDetector gesture={cardTap}>
      <Card className="relative flex flex-row justify-between">
        <CardHeader className="flex-1">
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
          <Pressable
            className="p-4"
            onPress={() => toggleFavorite({ uuid, type })}
            hitSlop={8}
          >
            <Star
              className={
                isFavorite(uuid) ? "text-yellow-500" : "text-foreground"
              }
            />
          </Pressable>
        )}
      </Card>
    </GestureDetector>
  );
}
