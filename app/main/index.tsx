import { useApplications } from "@/api/application";
import { useDatabases } from "@/api/databases";
import { useDeployments } from "@/api/deployments";
import { useProjects } from "@/api/projects";
import { useResources } from "@/api/resources";
import { useServers } from "@/api/servers";
import { useServices } from "@/api/services";
import { useTeams } from "@/api/teams";
import { DeploymentCard } from "@/components/cards/DeploymentCard";
import { FavoritesList } from "@/components/FavoritesList";
import { Database } from "@/components/icons/Database";
import { Layers } from "@/components/icons/Layers";
import { PackageOpen } from "@/components/icons/PackageOpen";
import { Server } from "@/components/icons/Server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useIsFocused } from "@react-navigation/native";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
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
  {
    label: "Services",
    route: "/main/services" as const,
    icon: <Server />,
  },
  {
    label: "Databases",
    route: "/main/databases" as const,
    icon: <Database />,
  },
];

export default function MainIndex() {
  const queryClient = useQueryClient();
  const fetchingQueries = useIsFetching();
  const isFocused = useIsFocused();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: deployments } = useDeployments({
    refetchInterval: 20000,
    enabled: isFocused,
  });

  useProjects();
  useApplications();
  useServices();
  useDatabases();
  useServers();
  useTeams();
  useResources();

  useEffect(() => {
    if (isReady) return;

    if (fallbackTimeout.current) {
      clearTimeout(fallbackTimeout.current);
    }

    fallbackTimeout.current = setTimeout(() => {
      SplashScreen.hide();
      setIsReady(true);
    }, 3000);

    if (fetchingQueries < 2) {
      timeout.current = setTimeout(() => {
        SplashScreen.hide();
        setIsReady(true);
      }, 500);
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (fallbackTimeout.current) {
        clearTimeout(fallbackTimeout.current);
      }
    };
  }, [fetchingQueries, isReady]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries().finally(() => setIsRefreshing(false));
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
