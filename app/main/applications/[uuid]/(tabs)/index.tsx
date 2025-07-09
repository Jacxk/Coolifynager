import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
} from "@/api/application";
import { getLatestApplicationDeployment } from "@/api/deployments";
import { AnimatedHeader } from "@/components/AnimatedHeaderTitle";
import { DomainsSelect } from "@/components/DomainsSelect";
import { HealthDialog } from "@/components/HealthDialog";
import LoadingScreen from "@/components/LoadingScreen";
import { ResourceActions } from "@/components/ResourceActions";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { cn } from "@/lib/utils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
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
  const navigation = useNavigation();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

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

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

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

  const healthy_running = data?.status === "running:healthy";
  const unhealthy_running = data?.status === "running:unhealthy";
  const unhealthy_exited = data?.status === "exited:unhealthy";

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldShowHeader = scrollY > 20;
    setShowHeaderTitle(shouldShowHeader);
  };

  useLayoutEffect(() => {
    if (data) {
      navigation.setOptions({
        header: () => (
          <AnimatedHeader
            name={data.name}
            status={data.status || ""}
            showTitle={showHeaderTitle}
            leftComponent={
              <DomainsSelect domains={data?.fqdn.split(",") as string[]} />
            }
            rightComponent={
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
            }
          />
        ),
        headerShown: true,
      });
    }
  }, [
    data,
    healthy_running,
    unhealthy_running,
    isDeploying,
    stopMutation.isPending,
    restartMutation.isPending,
    navigation,
    showHeaderTitle,
  ]);

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  return (
    <SafeView className="p-0" bottomInset={false}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerClassName="gap-4 p-4"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View>
          <View className="flex flex-row justify-between items-center">
            <H1 className="w-5/6" numberOfLines={1}>
              {data?.name}
            </H1>
            <TouchableOpacity
              className="w-1/6 items-end"
              onPress={() => setIsHealthDialogOpen(true)}
            >
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
      </ScrollView>
    </SafeView>
  );
}
