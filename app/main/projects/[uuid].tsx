import { getProject } from "@/api/projects";
import { getResources } from "@/api/resources";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { SectionList } from "react-native";

export default function Project() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data: project, isPending: projectPending } = useQuery(
    getProject(uuid)
  );
  const { data: resources, isPending: resourcesPending } = useQuery(
    getResources()
  );

  if (projectPending || resourcesPending) {
    return <LoadingScreen />;
  }

  if (!project || !resources) {
    return <Text>No project or resources found</Text>;
  }

  const projectEnvironmentIds = project.environments.map((env) => env.id);
  const filteredResources = resources.filter((resource) =>
    projectEnvironmentIds.includes(resource.environment_id)
  );

  const applications = filteredResources.filter(
    (res) => res.type === "application"
  );
  const databases = filteredResources.filter((res) =>
    res.name.includes("database")
  );
  const services = filteredResources.filter((res) => res.type === "service");

  const sections = [
    { title: "Applications", data: applications },
    { title: "Databases", data: databases },
    { title: "Services", data: services },
  ].filter((section) => section.data.length > 0);

  return (
    <SectionList
      className="flex-1 p-4"
      contentContainerClassName="gap-2"
      sections={sections}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <ApplicationCard
          uuid={item.uuid}
          name={item.name}
          description={item.description || undefined}
          status={item.status}
        />
      )}
      renderSectionHeader={({ section: { title } }) => <H3>{title}</H3>}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}
