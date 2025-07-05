import { getApplicationDeployments } from "@/api/deployments";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native";

export default function DeploymentsStack() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const { data, isPending, refetch } = useQuery(
    getApplicationDeployments(uuid)
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

  if (!data || data.count === 0) {
    return (
      <SafeView className="justify-center items-center">
        <Text>No deployments found.</Text>
      </SafeView>
    );
  }

  return (
    <FlatList
      className="flex-1 p-4"
      data={data.deployments}
      keyExtractor={(item) => item.deployment_uuid}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
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
              <Text>Status: {deployment.status}</Text>
              <Text>Commit: {deployment.commit.substring(0, 7)}</Text>
              <Text>Created: {deployment.created_at}</Text>
            </CardContent>
          </Card>
        </Link>
      )}
    />
  );
}
