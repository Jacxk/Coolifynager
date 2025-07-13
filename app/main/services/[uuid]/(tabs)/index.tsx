import {
  getService,
  restartService,
  startService,
  stopService,
  updateService,
} from "@/api/services";
import ResourceScreen from "@/components/resource/ResourceScreen";
import UpdateService from "@/components/resource/service/UpdateService";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={false}
      isApplication={false}
      getResource={getService}
      startResource={startService}
      stopResource={stopService}
      restartResource={restartService}
      updateResource={updateService}
      isEnabled={!isEditing}
    >
      {(data) => <UpdateService data={data} setIsEditing={setIsEditing} />}
    </ResourceScreen>
  );
}
