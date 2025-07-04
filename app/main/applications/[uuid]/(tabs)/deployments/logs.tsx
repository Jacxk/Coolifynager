import { getDeployment } from "@/api/deployments";
import { DeploymentLogData } from "@/api/types/deployments.types";
import LogsViewer from "@/components/LogsViewer";
import { SafeView } from "@/components/SafeView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

export default function DeploymentLogs() {
  const { deployment_uuid } = useLocalSearchParams<{
    deployment_uuid: string;
  }>();
  const { data } = useQuery({
    ...getDeployment(deployment_uuid),
    refetchInterval: 5000,
  });

  const logs = useMemo<DeploymentLogData[]>(
    () =>
      (JSON.parse(data?.logs ?? "[]") as DeploymentLogData[]).sort(
        (a, b) => (b.order ?? 0) - (a.order ?? 0)
      ),
    [data?.logs]
  );
  const [showHidden, setShowHidden] = useState(false);

  return (
    <SafeView className="gap-2" bottomInset={false}>
      <View className="flex flex-row gap-2 self-end">
        <Button onPress={() => setShowHidden((v) => !v)}>
          <Text>{showHidden ? "Hide" : "Show"} Debug Logs</Text>
        </Button>
      </View>
      <ScrollView className="flex-1 p-4 rounded-md border border-input">
        <LogsViewer
          logs={showHidden ? logs : logs?.filter((log) => !log.hidden)}
        />
      </ScrollView>
    </SafeView>
  );
}
