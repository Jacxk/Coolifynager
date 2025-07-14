import {
  getApplication,
  restartApplication,
  startApplication,
  stopApplication,
  updateApplication,
} from "@/api/application";
import { getLatestApplicationDeployment } from "@/api/deployments";
import UpdateApplication from "@/components/resource/application/update/UpdateApplication";
import ResourceScreen from "@/components/resource/ResourceScreen";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data } = useQuery(
    getApplication(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && !isDeploying && !isEditing,
    })
  );

  const isNotRunning = data?.status?.startsWith("exited");

  const { data: deploymentData } = useQuery(
    getLatestApplicationDeployment(uuid, {
      refetchInterval: isDeploying ? 5000 : 15000,
      enabled: isFocused && isNotRunning && !isEditing,
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
      getResource={getApplication}
      startResource={startApplication}
      stopResource={stopApplication}
      restartResource={restartApplication}
      updateResource={updateApplication}
      isEnabled={!isEditing}
    >
      {(data) => <UpdateApplication data={data} setIsEditing={setIsEditing} />}
    </ResourceScreen>
  );
}
