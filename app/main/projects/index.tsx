import { getProjects } from "@/api/projects";
import LoadingScreen from "@/components/LoadingScreen";
import { ProjectCard } from "@/components/ProjectCard";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

export default function ProjectsIndex() {
  const { data, isPending } = useQuery(getProjects);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <H1>Projects</H1>
        <Text>No projects found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-8">
      <H1>Projects</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}
