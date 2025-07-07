import { getTeam } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Team() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useQuery(getTeam(id));

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <SafeView>
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.id}</Text>
    </SafeView>
  );
}
