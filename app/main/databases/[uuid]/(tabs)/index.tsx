import {
  getDatabase,
  restartDatabase,
  startDatabase,
  stopDatabase,
} from "@/api/databases";
import { HealthDialog } from "@/components/HealthDialog";
import LoadingScreen from "@/components/LoadingScreen";
import { ResourceActions } from "@/components/ResourceActions";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { cn } from "@/lib/utils";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function Database() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);

  const {
    data,
    isPending: isPendingDatabase,
    refetch,
  } = useQuery(
    getDatabase(uuid, {
      refetchInterval: 20000,
      enabled: isFocused,
    })
  );

  const startMutation = useMutation(startDatabase(uuid));
  const stopMutation = useMutation(stopDatabase(uuid));
  const restartMutation = useMutation(restartDatabase(uuid));

  useRefreshOnFocus(refetch);

  const healthy_running = data?.status === "running:healthy";
  const unhealthy_running = data?.status === "running:unhealthy";
  const unhealthy_exited = data?.status === "exited:unhealthy";

  const handleStart = () => {
    startMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to start database");
      },
    });
  };

  const handleStop = () => {
    stopMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to stop database");
      },
    });
  };

  const handleRestart = () => {
    restartMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restart database");
      },
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  if (isPendingDatabase) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <SafeView className="p-4 gap-4 pt-0">
        <View className="flex flex-row gap-2 items-center justify-end">
          <ResourceActions
            resourceType="database"
            isRunning={healthy_running || unhealthy_running}
            onStart={handleStart}
            onStop={handleStop}
            onRestart={handleRestart}
            stopDisabled={stopMutation.isPending}
            restartDisabled={restartMutation.isPending}
          />
        </View>

        <View>
          <View className="flex flex-row justify-between items-center">
            <H1 numberOfLines={1} ellipsizeMode="tail">
              {data?.name}
            </H1>
            <TouchableOpacity onPress={() => setIsHealthDialogOpen(true)}>
              <View
                className={cn("size-4 rounded-full animate-pulse", {
                  "bg-red-500 animate-ping": unhealthy_exited,
                  "bg-green-500": healthy_running,
                  "bg-yellow-500": unhealthy_running,
                })}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-muted-foreground">{data?.description}</Text>
        </View>

        <Text>Status: {data?.status}</Text>
        <Text>Database Type: {data?.database_type}</Text>
        <Text>Image: {data?.image}</Text>

        {data?.internal_db_url && (
          <View>
            <Text className="font-semibold">Internal URL:</Text>
            <Text className="text-muted-foreground">
              {data.internal_db_url}
            </Text>
          </View>
        )}

        {data?.external_db_url && (
          <View>
            <Text className="font-semibold">External URL:</Text>
            <Text className="text-muted-foreground">
              {data.external_db_url}
            </Text>
          </View>
        )}

        {data?.public_port && <Text>Public Port: {data.public_port}</Text>}

        <Text>SSL Enabled: {data?.enable_ssl ? "Yes" : "No"}</Text>

        {data?.postgres_user && (
          <View>
            <Text className="font-semibold">Database Credentials:</Text>
            <Text className="text-muted-foreground">
              User: {data.postgres_user}
            </Text>
            <Text className="text-muted-foreground">
              Database: {data.postgres_db}
            </Text>
          </View>
        )}

        <HealthDialog
          isOpen={isHealthDialogOpen}
          onOpenChange={setIsHealthDialogOpen}
          status={data?.status}
          resourceType="database"
        />
      </SafeView>
    </ScrollView>
  );
}
