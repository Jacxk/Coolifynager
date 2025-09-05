import { ResourceType } from "@/api/types/resources.types";
import { useFavorites } from "@/context/FavoritesContext";
import { StatusText } from "@/utils/status";
import { LinkProps, router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
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

  const starTap = Gesture.Tap()
    .hitSlop(8)
    .shouldCancelWhenOutside(true)
    .onStart(() => {
      runOnJS(toggleFavorite)({ uuid, type });
    });
  const cardTap = Gesture.Tap()
    .shouldCancelWhenOutside(true)
    .requireExternalGestureToFail(starTap)
    .onStart(() => runOnJS(router.navigate)(href));
  const healthTap = Gesture.Tap().hitSlop(8).shouldCancelWhenOutside(true);

  return (
    <GestureDetector gesture={cardTap}>
      <Card className="relative flex flex-row justify-between">
        <CardHeader className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className={!isServerRunning ? "text-red-500" : ""}>
            {isServerRunning
              ? description || StatusText.resource(status || undefined)
              : "The underlying server has problems"}
          </CardDescription>
        </CardHeader>
        {status && (
          <GestureDetector gesture={healthTap}>
            <View collapsable={false} className="absolute top-2 left-2">
              <HealthIndicator status={status} iconClassName="size-2" />
            </View>
          </GestureDetector>
        )}
        {!hideFavorite && (
          <View className="p-4">
            <GestureDetector gesture={starTap}>
              <Star
                className={
                  isFavorite(uuid) ? "text-yellow-500" : "text-foreground"
                }
              />
            </GestureDetector>
          </View>
        )}
      </Card>
    </GestureDetector>
  );
}
