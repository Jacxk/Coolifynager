import {
  useDatabase,
  useDatabaseLogs,
  useRestartDatabase,
  useStartDatabase,
  useStopDatabase,
  useUpdateDatabase,
} from "@/api/databases";
import { Database as DatabaseType } from "@/api/types/database.types";
import UpdateDatabase from "@/components/resource/database/UpdateDatabase";
import ResourceScreen from "@/components/resource/ResourceScreen";
import { useLocalSearchParams } from "expo-router";

export default function Database() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  // Use the new hooks for data fetching
  useDatabase(uuid);
  useDatabaseLogs(uuid);

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={false}
      isApplication={false}
      useResource={useDatabase}
      useStartResource={useStartDatabase}
      useStopResource={useStopDatabase}
      useRestartResource={useRestartDatabase}
      useUpdateResource={useUpdateDatabase}
    >
      {(data) => <UpdateDatabase data={data as DatabaseType} />}
    </ResourceScreen>
  );
}
