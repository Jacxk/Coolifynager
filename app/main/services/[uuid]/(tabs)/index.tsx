import {
  getService,
  restartService,
  startService,
  stopService,
} from "@/api/services";
import ResourceScreen from "@/components/ResourceScreen";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

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
    >
      {(data) => (
        <>
          <Text>Status: {data?.status}</Text>
          <Text>Service Type: {data?.service_type}</Text>

          {data?.applications && data.applications.length > 0 && (
            <View>
              <Text className="font-semibold">Applications:</Text>
              {data.applications.map((app, index) => (
                <Text key={index} className="text-muted-foreground ml-4">
                  • {app.human_name || app.image}
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </ResourceScreen>
  );
}
