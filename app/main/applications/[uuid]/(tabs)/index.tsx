import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
} from "@/api/application";
import { getLatestApplicationDeployment } from "@/api/deployments";
import ResourceScreen from "@/components/ResourceScreen";
import { Text } from "@/components/ui/text";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [isDeploying, setIsDeploying] = useState(false);

  // Get application data for deployment tracking
  const { data } = useQuery(
    getApplication(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && !isDeploying,
    })
  );

  const isNotRunning = data?.status?.startsWith("exited");

  // Track deployment status
  const { data: deploymentData } = useQuery(
    getLatestApplicationDeployment(uuid, {
      refetchInterval: isDeploying ? 5000 : 15000,
      enabled: isFocused && isNotRunning,
    })
  );

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

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={isDeploying}
      isApplication={true}
      getResource={getApplication}
      startResource={startApplication}
      stopResource={stopApplication}
      restartResource={restartApplication}
    >
      {(data) => (
        <>
          <Text>Status: {data?.status}</Text>
          <Text>Branch: {data?.git_branch}</Text>
          <Text>Commits: {data?.git_commit_sha}</Text>
          <Text>Repository: {data?.git_repository}</Text>
        </>
      )}
    </ResourceScreen>
  );
}
