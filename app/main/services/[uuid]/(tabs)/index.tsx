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

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

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
    >
      {(data) => <UpdateService data={data} />}
    </ResourceScreen>
  );
}
