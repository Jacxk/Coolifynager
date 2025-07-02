import { getApplication } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending: isPendingApplication } = useQuery(
    getApplication(uuid)
  );

  const inset = useSafeAreaInsets();

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  return (
    <View
      className="p-4 flex-1"
      style={{
        paddingBottom: inset.bottom,
      }}
    >
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.status}</Text>
      <Text>{data?.git_branch}</Text>
      <Text>{data?.git_commit_sha}</Text>
      <Text>{data?.git_repository}</Text>
      <Button onPress={() => router.push(`/main/applications/${uuid}/logs`)}>
        <Text>Logs</Text>
      </Button>
    </View>
  );
}
