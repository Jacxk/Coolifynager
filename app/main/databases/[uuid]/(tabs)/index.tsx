import {
  getDatabase,
  restartDatabase,
  startDatabase,
  stopDatabase,
} from "@/api/databases";
import ResourceScreen from "@/components/ResourceScreen";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

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
    >
      {(data) => (
        <>
          <Text>Status: {data?.status}</Text>
          <Text>Database Type: {data?.database_type}</Text>
          <Text>Image: {data?.image}</Text>

          {data?.internal_db_url && (
            <View>
              <Text className="font-semibold">Internal URL:</Text>
              <Text className="text-muted-foreground">
                {data.internal_db_url}
              </Text>
            </View>
          )}

          {data?.external_db_url && (
            <View>
              <Text className="font-semibold">External URL:</Text>
              <Text className="text-muted-foreground">
                {data.external_db_url}
              </Text>
            </View>
          )}

          {data?.public_port && <Text>Public Port: {data.public_port}</Text>}

          <Text>SSL Enabled: {data?.enable_ssl ? "Yes" : "No"}</Text>

          {data?.postgres_user && (
            <View>
              <Text className="font-semibold">Database Credentials:</Text>
              <Text className="text-muted-foreground">
                User: {data.postgres_user}
              </Text>
              <Text className="text-muted-foreground">
                Database: {data.postgres_db}
              </Text>
            </View>
          )}
        </>
      )}
    </ResourceScreen>
  );
}
