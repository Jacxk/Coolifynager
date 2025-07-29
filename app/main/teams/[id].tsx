import { useTeam } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function Team() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useTeam(id);

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
