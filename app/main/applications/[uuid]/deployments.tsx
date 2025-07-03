import { getApplicationDeployments } from "@/api/deployments";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ApplicationDeployments() {
  const inset = useSafeAreaInsets();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending, refetch, isFetching } = useQuery(
    getApplicationDeployments(uuid)
  );

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.count === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No deployments found.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: inset.bottom,
      }}
    >
      <FlatList
        className="flex-1 p-4"
        data={data.deployments}
        keyExtractor={(item) => item.deployment_uuid}
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={({ item: deployment }) => (
          <Card
            className="mb-2"
            variant={
              deployment.status === "finished"
                ? "success"
                : deployment.status === "failed"
                ? "destructive"
                : "default"
            }
          >
            <CardHeader>
              <CardTitle>{deployment.commit_message}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>Status: {deployment.status}</Text>
              <Text>Commit: {deployment.commit.substring(0, 7)}</Text>
              <Text>Created: {deployment.created_at}</Text>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}
