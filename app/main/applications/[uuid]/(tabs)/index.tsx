import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
} from "@/api/application";
import { getApplicationDeployments } from "@/api/deployments";
import { ApplicationActions } from "@/components/ApplicationActions";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DomainsSelect({ domains }: { domains: string[] }) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select>
      <SelectTrigger>
        <Text>Links</Text>
      </SelectTrigger>
      <SelectContent insets={contentInsets}>
        <SelectGroup>
          {domains.map((domain) => (
            <SelectItem
              onPress={() => openBrowserAsync(domain)}
              label={domain}
              value={domain}
              key={domain}
              hideIndicator
            >
              {domain}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function HealthDialog({
  isOpen,
  onOpenChange: onClose,
  status,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: string | undefined;
}) {
  const getHealthContent = () => {
    switch (status) {
      case "running:unhealthy":
        return {
          title: (
            <View>
              <Text className="text-yellow-500">
                <Text className="text-muted-foreground">Unhealthy state. </Text>
                This doesn't mean that the resource is malfunctioning.
              </Text>
            </View>
          ),
          description: (
            <View>
              <Text className="text-muted-foreground">
                - If the resource is accessible, it indicates that no health
                check is configured - it is not mandatory.
              </Text>
              <Text className="text-muted-foreground">
                - If the resource is not accessible (returning 404 or 503), it
                may indicate that a health check is needed and has not passed.{" "}
                <Text className="text-yellow-500">
                  Your action is required.
                </Text>
              </Text>
              <Text className="text-muted-foreground mt-4">
                More details in the{" "}
                <Text
                  className="text-yellow-500 underline"
                  onPress={() =>
                    openBrowserAsync(
                      "https://coolify.io/docs/knowledge-base/proxy/traefik/healthchecks"
                    )
                  }
                >
                  documentation
                </Text>
                .
              </Text>
            </View>
          ),
        };
      case "exited:unhealthy":
        return {
          title: "Application is stopped",
          description: (
            <View>
              <Text className="text-muted-foreground">
                The application is not currently running.
              </Text>
            </View>
          ),
        };
      case "running:healthy":
        return {
          title: "Application is running",
          description: (
            <Text className="text-muted-foreground">
              The application is currently running and healthy.
            </Text>
          ),
        };
      default:
        return {
          title: "Health Status Information",
          description: (
            <Text className="text-muted-foreground">
              Current status: {status}
            </Text>
          ),
        };
    }
  };

  const { title, description } = getHealthContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">{title}</DialogTitle>
          <DialogDescription asChild>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);

  const {
    data,
    isPending: isPendingApplication,
    refetch,
  } = useQuery({
    ...getApplication(uuid),
    refetchInterval: 20000,
    enabled: !isDeploying,
  });

  const isNotRunning = data?.status?.startsWith("exited");

  const { data: deploymentData } = useQuery({
    ...getApplicationDeployments(uuid, 0, 1),
    refetchInterval: isDeploying ? 5000 : 15000,
    enabled: isNotRunning,
  });

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
        onSuccess: ({ deployment_uuid }) =>
          router.push({
            pathname: "./deployments/logs",
            params: { deployment_uuid },
          }),
      }
    );
  };

  const handleStop = () => {
    stopMutation.mutate();
  };

  const handleRestart = () => {
    restartMutation.mutate();
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
          <ApplicationActions
            isRunning={healthy_running || unhealthy_running}
            onDeploy={handleDeploy}
            onStop={handleStop}
            onRestart={handleRestart}
            isDeploying={isDeploying}
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
        <Text>{data?.status}</Text>
        <Text>{data?.git_branch}</Text>
        <Text>{data?.git_commit_sha}</Text>
        <Text>{data?.git_repository}</Text>

        <HealthDialog
          isOpen={isHealthDialogOpen}
          onOpenChange={setIsHealthDialogOpen}
          status={data?.status}
        />
      </SafeView>
    </ScrollView>
  );
}
