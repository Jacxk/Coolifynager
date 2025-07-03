import { getTeams } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import { TeamCard } from "@/components/TeamCard";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

export default function TeamsIndex() {
  const { data, isPending } = useQuery(getTeams);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <H1>Teams</H1>
        <Text>No teams found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-8">
      <H1>Teams</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TeamCard team={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}
