import {
  useRestartService,
  useService,
  useServiceLogs,
  useStartService,
  useStopService,
  useUpdateService,
} from "@/api/services";
import ResourceScreen from "@/components/resource/ResourceScreen";
import UpdateService from "@/components/resource/service/UpdateService";
import { useLocalSearchParams } from "expo-router";

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  // Use the new hooks for data fetching
  useService(uuid);
  useServiceLogs(uuid);

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={false}
      isApplication={false}
      useResource={useService}
      useStartResource={useStartService}
      useStopResource={useStopService}
      useRestartResource={useRestartService}
      useUpdateResource={useUpdateService}
    >
      {(data) => <UpdateService data={data as any} />}
    </ResourceScreen>
  );
}
