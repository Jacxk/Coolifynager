import { useApplications } from "@/api/application";
import { ResourceCard } from "@/components/cards/ResourceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ApplicationsIndex() {
  const { data, isPending, refetch } = useApplications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useRefreshOnFocus(refetch);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">No applications found.</Text>
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
            title={item.name}
            description={item.description}
            status={item.status}
            uuid={item.uuid}
            type="application"
            href={{
              pathname: "/main/applications/[uuid]/(tabs)",
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
