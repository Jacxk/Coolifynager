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
import { useState } from "react";

export default function Database() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const [isEditing, setIsEditing] = useState(false);

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
      isEnabled={!isEditing}
    >
      {(data) => <UpdateDatabase data={data} setIsEditing={setIsEditing} />}
    </ResourceScreen>
  );
}
