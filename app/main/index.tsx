import { getDeployments } from "@/api/deployments";
import { DeploymentCard } from "@/components/cards/DeploymentCard";
import { FavoritesList } from "@/components/FavoritesList";
import { Layers } from "@/components/icons/Layers";
import { PackageOpen } from "@/components/icons/PackageOpen";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const cards = [
  {
    label: "Projects",
    route: "/main/projects" as const,
    icon: <Layers />,
  },
  {
    label: "Applications",
    route: "/main/applications" as const,
    icon: <PackageOpen />,
  },
];

export default function MainIndex() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const { data: deployments, refetch } = useQuery(
    getDeployments({
      refetchInterval: 20000,
      enabled: isFocused,
    })
  );

  useRefreshOnFocus(refetch);

  const onRefresh = async () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerClassName="gap-10 p-4"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex flex-row flex-wrap">
        {cards.map((card) => (
          <Link key={card.label} href={card.route} className="flex w-1/2 p-2">
            <Card className="w-full">
              <CardHeader className="flex items-center justify-center">
                <CardTitle>{card.icon}</CardTitle>
                <CardDescription className="text-lg font-semibold">
                  {card.label}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </View>

      {/* TODO: fix deployment links, api is not returning the application uuid */}
      {deployments && deployments.length > 0 && (
        <View className="flex gap-4">
          <H2>Deployments</H2>
          {deployments.map((deployment) => (
            <DeploymentCard
              key={deployment.deployment_uuid}
              deployment={deployment}
            />
          ))}
        </View>
      )}

      <FavoritesList />
      <Link href="/setup/api_token">
        <Text>Change api token</Text>
      </Link>
    </ScrollView>
  );
}
