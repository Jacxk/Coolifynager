import { getApplicationLogs } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ApplicationLogs() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data: logData, isPending: isPendingLogs } = useQuery(
    getApplicationLogs(uuid)
  );

  const inset = useSafeAreaInsets();

  if (isPendingLogs) {
    return <LoadingScreen />;
  }

  return (
    <View
      className="flex-1"
      style={{
        paddingBottom: inset.bottom,
      }}
    >
      <Textarea
        className="h-full"
        value={logData?.logs ?? "No logs found"}
        editable={false}
      />
    </View>
  );
}
