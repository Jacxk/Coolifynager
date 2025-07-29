import { useServices } from "@/api/services";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ResourcesSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ServicesIndex() {
  const { data, isPending, refetch } = useServices();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useRefreshOnFocus(refetch);

  if (isPending) {
    return <ResourcesSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">No services found.</Text>
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
            status={item.status}
            serverStatus={item.server.proxy.status}
            type="service"
            href={{
              pathname: "/main/services/[uuid]/(tabs)",
              params: { uuid: item.uuid, name: item.name },
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
