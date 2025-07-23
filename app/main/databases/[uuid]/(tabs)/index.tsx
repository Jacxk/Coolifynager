import {
  getDatabase,
  restartDatabase,
  startDatabase,
  stopDatabase,
  updateDatabase,
} from "@/api/databases";
import UpdateDatabase from "@/components/resource/database/UpdateDatabase";
import ResourceScreen from "@/components/resource/ResourceScreen";
import { useLocalSearchParams } from "expo-router";

export default function Database() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  return (
    <ResourceScreen
      uuid={uuid}
      isDeploying={false}
      isApplication={false}
      getResource={getDatabase}
      startResource={startDatabase}
      stopResource={stopDatabase}
      restartResource={restartDatabase}
      updateResource={updateDatabase}
    >
      {(data) => <UpdateDatabase data={data} />}
    </ResourceScreen>
  );
}
