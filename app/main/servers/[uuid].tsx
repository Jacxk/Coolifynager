import { useServer } from "@/api/servers";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function Server() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending } = useServer(uuid);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <SafeView>
      <Text>{data?.name}</Text>
      <Text>{data?.uuid}</Text>
    </SafeView>
  );
}
