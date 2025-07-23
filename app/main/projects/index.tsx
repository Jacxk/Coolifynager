import { getProjects } from "@/api/projects";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ProjectsSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";

export default function ProjectsIndex() {
  const { data, isPending, refetch } = useQuery(getProjects());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isPending) {
    return <ProjectsSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView className="justify-center items-center">
        <Text>No projects found.</Text>
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
            type="project"
            href={{
              pathname: "/main/projects/[uuid]",
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
