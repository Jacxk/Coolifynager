import { getTeams } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { TeamCard } from "@/components/TeamCard";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TeamsIndex() {
  const { data, isPending } = useQuery(getTeams);
  const inset = useSafeAreaInsets();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView>
        <H1>Teams</H1>
        <Text>No teams found.</Text>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <H1>Teams</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TeamCard team={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeView>
  );
}
