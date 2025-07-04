import { getServers } from "@/api/servers";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { ServerCard } from "@/components/ServerCard";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ServersIndex() {
  const { data, isPending, refetch } = useQuery(getServers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inset = useSafeAreaInsets();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView>
        <H1>Servers</H1>
        <Text>No servers found.</Text>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <H1>Servers</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ServerCard server={item} />}
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
