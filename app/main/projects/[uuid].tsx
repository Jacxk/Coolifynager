import { useProject } from "@/api/projects";
import { useResources } from "@/api/resources";
import { CoolifyDatabaseType } from "@/api/types/database.types";
import { Resource, ResourceType } from "@/api/types/resources.types";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { ChevronUp } from "@/components/icons/ChevronUp";
import { SafeView } from "@/components/SafeView";
import { ProjectSkeleton } from "@/components/skeletons/ProjectSkeleton";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { LinkProps, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, SectionList, View } from "react-native";

const isDatabase = (resource: Resource) => {
  return Object.values(CoolifyDatabaseType).includes(
    resource.type as CoolifyDatabaseType
  );
};

export default function Project() {
  const navigation = useNavigation();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const {
    data: project,
    isPending: projectPending,
    refetch: refetchProject,
  } = useProject(uuid);
  const {
    data: resources,
    isPending: resourcesPending,
    refetch: refetchResources,
  } = useResources();

  const [refreshing, setRefreshing] = useState(false);

  const refetch = useCallback(async () => {
    await refetchProject();
    await refetchResources();
  }, [refetchProject, refetchResources]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  useRefreshOnFocus(refetch);
  useEffect(() => {
    if (project?.environments) {
      navigation.setParams({
        environments: project.environments.map(
          (env) => `${env.uuid}:${env.name}`
        ),
      } as any);
    }
  }, [project, navigation]);

  if (projectPending || resourcesPending) {
    return <ProjectSkeleton />;
  }

  if (!project || !resources) {
    return (
      <SafeView className="justify-center items-center relative">
        <Text className="text-muted-foreground">No project found</Text>
      </SafeView>
    );
  }

  const projectEnvironmentIds = useMemo(
    () => project.environments.map((env) => env.id),
    [project.environments]
  );

  const filteredResources = useMemo(
    () =>
      resources.filter((resource) =>
        projectEnvironmentIds.includes(resource.environment_id)
      ),
    [resources, projectEnvironmentIds]
  );

  const applications = useMemo(
    () => filteredResources.filter((res) => res.type === "application"),
    [filteredResources]
  );

  const databases = useMemo(
    () => filteredResources.filter(isDatabase),
    [filteredResources]
  );

  const services = useMemo(
    () => filteredResources.filter((res) => res.type === "service"),
    [filteredResources]
  );

  const sections = useMemo(
    () =>
      [
        { title: "Applications", data: applications },
        { title: "Databases", data: databases },
        { title: "Services", data: services },
      ].filter((section) => section.data.length > 0),
    [applications, databases, services]
  );

  if (sections.length === 0) {
    return (
      <SafeView className="justify-center items-center relative">
        <Text className="text-muted-foreground">
          No resources found on this project.
        </Text>
        <View className="absolute top-2 right-7 animate-bounce flex flex-row items-center gap-2">
          <Text className="text-muted-foreground">Create new resource</Text>
          <ChevronUp className="text-muted-foreground" size={16} />
        </View>
      </SafeView>
    );
  }

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

        // If the resource is not a service, we need to get the server status from the destination
        const serverStatus = (item.destination || item).server.proxy.status;

        return (
          <ResourceCard
            uuid={item.uuid}
            title={item.name}
            description={item.description}
            status={item.status}
            href={props.href}
            type={props.type}
            serverStatus={serverStatus}
          />
        );
      }}
      renderSectionHeader={({ section: { title } }) => <H3>{title}</H3>}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}
