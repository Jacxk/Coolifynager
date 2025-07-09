import {
  getService,
  restartService,
  startService,
  stopService,
} from "@/api/services";
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
import { useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  const {
    data,
    isPending: isPendingService,
    refetch,
  } = useQuery(
    getService(uuid, {
      refetchInterval: 20000,
      enabled: isFocused,
    })
  );

  const startMutation = useMutation(startService(uuid));
  const stopMutation = useMutation(stopService(uuid));
  const restartMutation = useMutation(restartService(uuid));

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
        toast.error(error.message || "Failed to start service");
      },
    });
  };

  const handleStop = () => {
    stopMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to stop service");
      },
    });
  };

  const handleRestart = () => {
    restartMutation.mutate(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restart service");
      },
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldShowHeader = scrollY > 20;
    setShowHeaderTitle(shouldShowHeader);
  };

  const domains =
    data?.applications
      ?.map((app) => app.fqdn)
      .filter(Boolean)
      .flatMap((fqdn) => fqdn.split(","))
      .filter(Boolean) || [];

  useLayoutEffect(() => {
    if (data) {
      navigation.setOptions({
        header: () => (
          <AnimatedHeader
            name={data.name}
            status={data.status || ""}
            showTitle={showHeaderTitle}
            leftComponent={<DomainsSelect domains={domains} />}
            rightComponent={
              <ResourceActions
                resourceType="service"
                isRunning={healthy_running || unhealthy_running}
                onStart={handleStart}
                onStop={handleStop}
                onRestart={handleRestart}
                stopDisabled={stopMutation.isPending}
                restartDisabled={restartMutation.isPending}
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
    stopMutation.isPending,
    restartMutation.isPending,
    navigation,
    domains,
    showHeaderTitle,
  ]);

  if (isPendingService) {
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

        <Text>Status: {data?.status}</Text>
        <Text>Service Type: {data?.service_type}</Text>
        {data?.applications && data.applications.length > 0 && (
          <View>
            <Text className="font-semibold">Applications:</Text>
            {data.applications.map((app, index) => (
              <Text key={index} className="text-muted-foreground ml-4">
                • {app.human_name || app.image}
              </Text>
            ))}
          </View>
        )}

        <HealthDialog
          isOpen={isHealthDialogOpen}
          onOpenChange={setIsHealthDialogOpen}
          status={data?.status}
          resourceType="service"
        />
      </ScrollView>
    </SafeView>
  );
}
