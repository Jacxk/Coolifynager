import { getApplication } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending: isPendingApplication } = useQuery(
    getApplication(uuid)
  );

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  return (
    <SafeView className="p-4">
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.status}</Text>
      <Text>{data?.git_branch}</Text>
      <Text>{data?.git_commit_sha}</Text>
      <Text>{data?.git_repository}</Text>
    </SafeView>
  );
}
