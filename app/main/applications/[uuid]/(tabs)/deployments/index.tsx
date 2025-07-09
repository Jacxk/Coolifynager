import { getApplicationDeployments } from "@/api/deployments";
import { DeploymentCard } from "@/components/cards/DeploymentCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
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
  } = useInfiniteQuery(
    getApplicationDeployments(uuid, 5, {
      refetchInterval: 20000,
    })
  );

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
    <SafeView className="p-0" bottomInset={false}>
      <FlatList
        contentContainerClassName="p-4"
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
          <DeploymentCard
            key={deployment.deployment_uuid}
            deployment={deployment}
          />
        )}
      />
    </SafeView>
  );
}
