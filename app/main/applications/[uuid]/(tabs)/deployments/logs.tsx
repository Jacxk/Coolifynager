import { getDeploymentLogs } from "@/api/deployments";
import { DeploymentLogData } from "@/api/types/deployments.types";
import LogsViewer from "@/components/LogsViewer";
import { SafeView } from "@/components/SafeView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { StatusText } from "@/utils/status";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function DeploymentLogs() {
  const { deployment_uuid } = useLocalSearchParams<{
    deployment_uuid: string;
  }>();
  const isFocused = useIsFocused();
  const [isFinished, setIsFinished] = useState(false);

  const { data, isPending } = useQuery(
    getDeploymentLogs(deployment_uuid, {
      refetchInterval: 2000,
      enabled: isFocused && !isFinished,
    })
  );

  useEffect(() => {
    if (
      data?.status === "finished" ||
      data?.status === "failed" ||
      data?.status === "cancelled-by-user"
    ) {
      setIsFinished(true);
    }
  }, [data?.status]);

  const logs = useMemo<DeploymentLogData[]>(
    () => JSON.parse(data?.logs ?? "[]") as DeploymentLogData[],
    [data?.logs]
  );
  const [showHidden, setShowHidden] = useState(false);

  return (
    <SafeView className="gap-2" bottomInset={false}>
      <View className="flex flex-row gap-2 justify-between items-center">
        <H3>Deployment Log</H3>
        <Button onPress={() => setShowHidden((v) => !v)}>
          <Text>{showHidden ? "Hide" : "Show"} Debug Logs</Text>
        </Button>
      </View>

      <Text className="text-muted-foreground">
        Deployment is{" "}
        <Text className="text-yellow-500">
          {StatusText.deployment(data?.status)}
        </Text>
        .
      </Text>
      <LogsViewer
        logs={showHidden ? logs : logs?.filter((log) => !log.hidden)}
        isLoading={isPending}
      />
    </SafeView>
  );
}
