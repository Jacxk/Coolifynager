import { getProject } from "@/api/projects";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Project() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending } = useQuery(getProject(uuid));

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
