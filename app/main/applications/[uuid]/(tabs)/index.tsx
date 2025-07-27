import {
  useApplication,
  useApplicationLogs,
  useRestartApplication,
  useStartApplication,
  useStopApplication,
  useUpdateApplication,
} from "@/api/application";
import {
  useApplicationDeployments,
  useLatestApplicationDeployment,
} from "@/api/deployments";
import UpdateApplication from "@/components/resource/application/update/UpdateApplication";
import ResourceScreen from "@/components/resource/ResourceScreen";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [isDeploying, setIsDeploying] = useState(false);

  useApplicationLogs(uuid);
  useApplicationDeployments(uuid);
  const { data } = useApplication(uuid, {
    refetchInterval: 20000,
    enabled: isFocused && !isDeploying,
  });

  const isNotRunning = data?.status?.startsWith("exited");

  const { data: deploymentData } = useLatestApplicationDeployment(uuid, {
    refetchInterval: isDeploying ? 5000 : 15000,
    enabled: isFocused && isNotRunning,
  });

  useEffect(() => {
    if (!isNotRunning) {
      setIsDeploying(false);
      return;
    }

    const latestDeployment = deploymentData?.deployments[0];
    if (latestDeployment) {
      if (
        latestDeployment.status === "in_progress" &&
        !latestDeployment.restart_only
      ) {
        setIsDeploying(true);
      } else {
        setIsDeploying(false);
      }
    }
  }, [deploymentData?.deployments, isNotRunning]);

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={isDeploying}
      isApplication={true}
      useResource={useApplication}
      useStartResource={useStartApplication}
      useStopResource={useStopApplication}
      useRestartResource={useRestartApplication}
      useUpdateResource={useUpdateApplication}
    >
      {(data) => <UpdateApplication data={data as any} />}
    </ResourceScreen>
  );
}
