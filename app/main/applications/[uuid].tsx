import { getApplication, getApplicationLogs } from "@/api/application";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data } = useQuery(getApplication(uuid));
  const { data: logData } = useQuery(getApplicationLogs(uuid));

  const inset = useSafeAreaInsets()

  return (
    <View className="p-4 flex-1" style={{
      paddingBottom: inset.bottom
    }}>
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.status}</Text>
      <Text>{data?.git_branch}</Text>
      <Text>{data?.git_commit_sha}</Text>
      <Text>{data?.git_repository}</Text>
      <Textarea className="h-full" value={logData?.logs ?? "No logs found"} editable={false} />
    </View>
  );
}
