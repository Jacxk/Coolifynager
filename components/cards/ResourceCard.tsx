import { ResourceType } from "@/api/types/resources.types";
import { useFavorites } from "@/context/FavoritesContext";
import { LinkProps, router } from "expo-router";
import React from "react";
import { View } from "react-native";
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

  const starTap = Gesture.Tap()
    .hitSlop(8)
    .runOnJS(true)
    .onStart(() => {
      toggleFavorite({ uuid, type });
    });

  return (
    <GestureDetector gesture={Gesture.Exclusive(cardTap, starTap)}>
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
          <GestureDetector gesture={starTap}>
            <View className="p-4">
              <Star
                className={
                  isFavorite(uuid) ? "text-yellow-500" : "text-foreground"
                }
              />
            </View>
          </GestureDetector>
        )}
      </Card>
    </GestureDetector>
  );
}
