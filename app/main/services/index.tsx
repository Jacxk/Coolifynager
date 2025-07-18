import { getServices } from "@/api/services";
import { ResourceCard } from "@/components/cards/ResourceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ServicesIndex() {
  const { data, isPending, refetch } = useQuery(getServices());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView>
        <H1>Services</H1>
        <Text>No services found.</Text>
      </SafeView>
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
