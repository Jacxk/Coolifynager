import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
} from "@/api/application";
import { getLatestApplicationDeployment } from "@/api/deployments";
import { DomainsSelect } from "@/components/DomainsSelect";
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
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);

  const {
    data,
    isPending: isPendingApplication,
    refetch,
  } = useQuery(
    getApplication(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && !isDeploying,
    })
  );

  const isNotRunning = data?.status?.startsWith("exited");

  const { data: deploymentData } = useQuery(
    getLatestApplicationDeployment(uuid, {
      refetchInterval: isDeploying ? 5000 : 15000,
      enabled: isFocused && isNotRunning,
    })
  );

  const startMutation = useMutation(startApplication(uuid));
  const stopMutation = useMutation(stopApplication(uuid));
  const restartMutation = useMutation(restartApplication(uuid));

  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (!isNotRunning) {
      setIsDeploying(false);
      return;
    }

    const latestDeployment = deploymentData?.deployments[0];
    if (latestDeployment) {
      if (
        latestDeployment.status === "in_progress" &&
        !latestDeployment.restart_only &&
        data?.status?.startsWith("exited")
      ) {
        setIsDeploying(true);
      } else {
        setIsDeploying(false);
      }
    }
  }, [data?.status, deploymentData?.deployments, isNotRunning]);

  const healthy_running = data?.status === "running:healthy";
  const unhealthy_running = data?.status === "running:unhealthy";
  const unhealthy_exited = data?.status === "exited:unhealthy";

  const handleDeploy = () => {
    startMutation.mutate(
      { force: false, instant_deploy: false },
      {
        onSuccess: ({ deployment_uuid, message }) => {
          toast.success(message);
          router.push({
            pathname: "./deployments/logs",
            params: { deployment_uuid },
          });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to deploy application");
        },
      }
    );
  };

  const handleStop = () => {
    stopMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to stop application");
      },
    });
  };

  const handleRestart = () => {
    restartMutation.mutate(undefined, {
      onSuccess: ({ message, deployment_uuid }) => {
        toast.success(message);

        router.push({
          pathname: "./deployments/logs",
          params: { deployment_uuid },
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restart application");
      },
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <SafeView className="p-4 gap-4 pt-0">
        <View className="flex flex-row gap-2 items-center justify-between">
          <DomainsSelect domains={data?.fqdn.split(",") as string[]} />
          <ResourceActions
            resourceType="application"
            isRunning={healthy_running || unhealthy_running}
            onStart={handleDeploy}
            onRedeploy={handleDeploy}
            onStop={handleStop}
            onRestart={handleRestart}
            isDeploying={isDeploying}
            stopDisabled={stopMutation.isPending}
            restartDisabled={restartMutation.isPending}
            showDeploy={true}
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
        <Text>{data?.status}</Text>
        <Text>{data?.git_branch}</Text>
        <Text>{data?.git_commit_sha}</Text>
        <Text>{data?.git_repository}</Text>

        <HealthDialog
          isOpen={isHealthDialogOpen}
          onOpenChange={setIsHealthDialogOpen}
          status={data?.status}
          resourceType="application"
        />
      </SafeView>
    </ScrollView>
  );
}
