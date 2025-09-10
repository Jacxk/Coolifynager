import { useDeploymentLogs } from "@/api/deployments";
import { DeploymentLogData } from "@/api/types/deployments.types";
import LogsViewer from "@/components/LogsViewer";
import { SafeView } from "@/components/SafeView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { LOG_REFETCH_INTERVAL_STORAGE_KEY } from "@/constants/StorageKeys";
import { StatusText } from "@/utils/status";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function DeploymentLogs() {
  const navigation = useNavigation();
  const { deployment_uuid, uuid } = useLocalSearchParams<{
    deployment_uuid: string;
    uuid: string;
  }>();
  const isFocused = useIsFocused();
  const [isFinished, setIsFinished] = useState(false);

  const refetchInterval =
    Number(AsyncStorage.getItem(LOG_REFETCH_INTERVAL_STORAGE_KEY)) || 2000;

  const { data, isPending } = useDeploymentLogs(deployment_uuid, {
    refetchInterval,
    enabled: isFocused && !isFinished,
  });

  useEffect(() => {
    if (
      data?.status === "finished" ||
      data?.status === "failed" ||
      data?.status === "cancelled-by-user"
    ) {
      setIsFinished(true);
    }
  }, [data?.status]);

  useLayoutEffect(() => {
    if (uuid === "never") {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [uuid]);

  const logs = useMemo<DeploymentLogData[]>(
    () => (JSON.parse(data?.logs ?? "[]") as DeploymentLogData[]).toReversed(),
    [data?.logs]
  );
  const [showHidden, setShowHidden] = useState(false);

  return (
    <SafeView
      className="gap-2"
      bottomInset={uuid === "never"}
      topInset={uuid === "never"}
    >
      <H2>{data?.commit_message ?? "Manual Deployment"}</H2>
      <View className="flex flex-row gap-2 justify-between items-end">
        <Text className="text-muted-foreground">
          Deployment{" "}
          <Text className="text-yellow-500">
            {StatusText.deployment(data?.status ?? "--")}
          </Text>
          .
        </Text>
        <Button onPress={() => setShowHidden((v) => !v)}>
          <Text>{showHidden ? "Hide" : "Show"} Debug Logs</Text>
        </Button>
      </View>

      <LogsViewer
        logs={showHidden ? logs : logs?.filter((log) => !log.hidden)}
        isLoading={isPending}
      />
    </SafeView>
  );
}
