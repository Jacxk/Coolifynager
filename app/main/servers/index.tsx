import { getServers } from "@/api/servers";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ResourcesSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ServersIndex() {
  const { data, isPending, refetch } = useQuery(getServers());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isPending) {
    return <ResourcesSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">No servers found.</Text>
      </View>
    );
  }

  return (
    <SafeView className="p-0">
      <FlatList
        contentContainerClassName="p-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <ResourceCard
            uuid={item.uuid}
            title={item.name}
            description={item.description}
            type="server"
            href={{
              pathname: "/main/servers/[uuid]",
              params: { uuid: item.uuid, name: item.name },
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshing={isRefreshing}
        onRefresh={async () => {
          setIsRefreshing(true);
          await refetch().finally(() => setIsRefreshing(false));
        }}
      />
    </SafeView>
  );
}
