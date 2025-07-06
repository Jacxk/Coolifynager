import { getApplicationDeployments } from "@/api/deployments";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { StatusText } from "@/utils/status";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

export default function DeploymentsStack() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const {
    data,
    isPending,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getApplicationDeployments(uuid));

  useRefreshOnFocus(refetch);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || !data.pages[0]?.count) {
    return (
      <SafeView className="justify-center items-center">
        <Text>No deployments found.</Text>
      </SafeView>
    );
  }

  const deployments = data.pages.flatMap((page) => page.deployments);

  return (
    <FlatList
      className="flex-1 p-4"
      data={deployments ?? Array.from({ length: 10 })}
      keyExtractor={(item) => item.deployment_uuid}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isFetchingNextPage && <ActivityIndicator className="py-4" />
      }
      renderItem={({ item: deployment }) => (
        <Link
          className="mb-2"
          href={{
            pathname: "./deployments/logs",
            params: { deployment_uuid: deployment.deployment_uuid },
          }}
        >
          <Card
            className="w-full"
            variant={
              deployment.status === "finished"
                ? "success"
                : deployment.status === "failed"
                ? "destructive"
                : deployment.status === "in_progress"
                ? "info"
                : deployment.status === "cancelled-by-user"
                ? "ghost"
                : "default"
            }
          >
            <CardHeader>
              <CardTitle>
                {deployment.commit_message ?? "Manual Deployment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text>Status: {StatusText.deployment(deployment.status)}</Text>
              <Text>Commit: {deployment.commit.substring(0, 7)}</Text>
              <Text>Created: {deployment.created_at}</Text>
            </CardContent>
          </Card>
        </Link>
      )}
    />
  );
}
