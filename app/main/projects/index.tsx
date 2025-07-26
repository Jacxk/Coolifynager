import { getProjects } from "@/api/projects";
import { queryClient } from "@/app/_layout";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ResourcesSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { SwipeGesture } from "@/components/ui/swipe-card";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ProjectsIndex() {
  const { data, isPending, refetch } = useQuery(getProjects());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useRefreshOnFocus(refetch);

  if (isPending) {
    return <ResourcesSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">No projects found.</Text>
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
          <SwipeGesture
            rightContentClassName="rounded-r-lg bg-red-400 dark:bg-red-500"
            rightContent={<Trash />}
            onSwipeRight={() =>
              // TESTING
              queryClient.setQueryData(
                ["projects"],
                data.filter((d) => d.uuid !== item.uuid)
              )
            }
          >
            <ResourceCard
              uuid={item.uuid}
              title={item.name}
              description={item.description}
              type="project"
              href={{
                pathname: "/main/projects/[uuid]",
                params: { uuid: item.uuid, name: item.name },
              }}
            />
          </SwipeGesture>
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
