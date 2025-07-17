import { getProject } from "@/api/projects";
import { getResources } from "@/api/resources";
import { ResourceType } from "@/api/types/resources.types";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { ProjectSkeleton } from "@/components/skeletons/ProjectSkeleton";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useQuery } from "@tanstack/react-query";
import { LinkProps, useLocalSearchParams } from "expo-router";
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
    return <ProjectSkeleton />;
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
        const props: Partial<{
          type: ResourceType;
          href: LinkProps["href"];
        }> = {};

        if (title === "Applications") {
          props.type = "application";
          props.href = {
            pathname: "/main/applications/[uuid]/(tabs)",
            params: { uuid: item.uuid, name: item.name },
          };
        } else if (title === "Databases") {
          props.type = "database";
          props.href = {
            pathname: "/main/databases/[uuid]/(tabs)",
            params: { uuid: item.uuid, name: item.name },
          };
        } else if (title === "Services") {
          props.type = "service";
          props.href = {
            pathname: "/main/services/[uuid]/(tabs)",
            params: { uuid: item.uuid, name: item.name },
          };
        }

        if (!props.type || !props.href) {
          return null;
        }

        return (
          <ResourceCard
            uuid={item.uuid}
            title={item.name}
            description={item.description || item.status}
            href={props.href}
            type={props.type}
          />
        );
      }}
      renderSectionHeader={({ section: { title } }) => <H3>{title}</H3>}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}
