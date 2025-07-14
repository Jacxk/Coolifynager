import { getProject } from "@/api/projects";
import { getResources } from "@/api/resources";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { DatabaseCard } from "@/components/cards/DatabaseCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, SectionList } from "react-native";

export default function Project() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const {
    data: project,
    isPending: projectPending,
    refetch: refetchProject,
  } = useQuery(getProject(uuid));
  const {
    data: resources,
    isPending: resourcesPending,
    refetch: refetchResources,
  } = useQuery(getResources());

  const [refreshing, setRefreshing] = useState(false);

  useRefreshOnFocus(async () => {
    await refetchProject();
    await refetchResources();
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchProject();
    await refetchResources();
    setRefreshing(false);
  };

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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1 p-4"
      contentContainerClassName="gap-2"
      sections={sections}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item, section: { title } }) => {
        if (title === "Applications") {
          return (
            <ApplicationCard
              uuid={item.uuid}
              name={item.name}
              description={item.description || undefined}
              status={item.status}
            />
          );
        } else if (title === "Databases") {
          return (
            <DatabaseCard
              uuid={item.uuid}
              name={item.name}
              description={item.description || undefined}
              status={item.status}
              database_type={item.static_image || "Database"}
            />
          );
        } else if (title === "Services") {
          return (
            <ServiceCard
              uuid={item.uuid}
              name={item.name}
              description={item.description || undefined}
              status={item.status}
              service_type={item.static_image || "Service"}
            />
          );
        }

        return null;
      }}
      renderSectionHeader={({ section: { title } }) => <H3>{title}</H3>}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}
