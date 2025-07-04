import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
} from "@/api/application";
import { ApplicationActions } from "@/components/ApplicationActions";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
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

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const {
    data,
    isPending: isPendingApplication,
    refetch,
  } = useQuery(getApplication(uuid));

  const [isRefreshing, setIsRefreshing] = useState(false);

  const startMutation = useMutation(startApplication(uuid));
  const stopMutation = useMutation(stopApplication(uuid));
  const restartMutation = useMutation(restartApplication(uuid));

  const handleStart = () => {
    startMutation.mutate(
      { force: false, instant_deploy: false },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const handleStop = () => {
    stopMutation.mutate(undefined, {
      onSuccess: () => refetch(),
    });
  };

  const handleRestart = () => {
    restartMutation.mutate(undefined, {
      onSuccess: () => refetch(),
    });
  };

  const healthy_running = data?.status === "running:healthy";
  const unhealthy_running = data?.status === "running:unhealthy";
  const unhealthy_exited = data?.status === "exited:unhealthy";

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

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
            onStart={handleStart}
            onStop={handleStop}
            onRestart={handleRestart}
            startDisabled={startMutation.isPending}
            stopDisabled={stopMutation.isPending}
            restartDisabled={restartMutation.isPending}
          />
        </View>
        <View>
          <View className="flex flex-row justify-between items-center">
            <H1 numberOfLines={1} ellipsizeMode="tail">
              {data?.name}
            </H1>
            <View
              className={cn("size-4 rounded-full animate-pulse", {
                "bg-red-500 animate-ping": unhealthy_exited,
                "bg-green-500": healthy_running,
                "bg-yellow-500": unhealthy_running,
              })}
            />
          </View>
          <Text className="text-muted-foreground">{data?.description}</Text>
        </View>
        <Text>{data?.status}</Text>
        <Text>{data?.git_branch}</Text>
        <Text>{data?.git_commit_sha}</Text>
        <Text>{data?.git_repository}</Text>
      </SafeView>
    </ScrollView>
  );
}
