import { getService } from "@/api/services";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending } = useQuery(getService(uuid));

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <SafeView>
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.uuid}</Text>
    </SafeView>
  );
}
