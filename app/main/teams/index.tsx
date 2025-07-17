import { getTeams } from "@/api/teams";
import { ResourceCard } from "@/components/cards/ResourceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function TeamsIndex() {
  const { data, isPending, refetch } = useQuery(getTeams());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <SafeView className="p-0">
      <FlatList
        contentContainerClassName="p-4"
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ResourceCard
            uuid={item.id.toString()}
            title={item.name}
            description={item.description}
            type="team"
            href={{
              pathname: "/main/teams/[id]",
              params: { id: item.id.toString() },
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          refetch().finally(() => setIsRefreshing(false));
        }}
      />
    </SafeView>
  );
}
