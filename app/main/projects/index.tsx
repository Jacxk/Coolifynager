import { getProjects } from "@/api/projects";
import { ProjectCard } from "@/components/cards/ProjectCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProjectsIndex() {
  const { data, isPending, refetch } = useQuery(getProjects());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inset = useSafeAreaInsets();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView>
        <H1>Projects</H1>
        <Text>No projects found.</Text>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <H1>Projects</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ProjectCard project={item} />}
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
