import { deleteProject, getProjects } from "@/api/projects";
import { Project, ProjectBase } from "@/api/types/project.types";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ResourcesSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { SwipeableCard } from "@/components/ui/swipe-card";
import { Text } from "@/components/ui/text";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { toast } from "sonner-native";

const ProjectCard = ({ uuid, name, description }: ProjectBase) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteProject(uuid));

  const isUndo = useRef(false);
  const position = useRef(0);

  const handleDismiss = () => {
    if (!isUndo.current) {
      mutate();
      isUndo.current = false;
    }
  };

  return (
    <SwipeableCard
      threshold={70}
      rightContentClassName="rounded-r-lg bg-red-400 dark:bg-red-500 -ml-4"
      rightContent={<Trash color="black" />}
      dismissOnSwipeLeft
      onDismiss={() => {
        const project = queryClient.getQueryData<Project>(["projects", uuid]);

        if (!project) return;

        queryClient.setQueryData(["projects"], (data: ProjectBase[]) => {
          const index = data.findIndex((d) => d.uuid === project.uuid);
          const newData = [...data];
          newData.splice(index, 1);
          position.current = index;
          return newData;
        });

        queryClient.removeQueries({
          queryKey: ["projects", project.uuid],
          exact: true,
        });

        toast.success("Project deleted", {
          id: project.uuid,
          action: {
            label: "Undo",
            onClick: () => {
              isUndo.current = true;
              queryClient.setQueryData(["projects"], (data: ProjectBase[]) => {
                const newData = [...data];
                newData.splice(position.current, 0, project);
                return newData;
              });
              queryClient.setQueryData<Project>(
                ["projects", project.uuid],
                project
              );
              toast.dismiss(project.uuid);
            },
          },
          onAutoClose: handleDismiss,
        });
      }}
    >
      <ResourceCard
        uuid={uuid}
        title={name}
        description={description}
        type="project"
        href={{
          pathname: "/main/projects/[uuid]",
          params: { uuid, name },
        }}
      />
    </SwipeableCard>
  );
};

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
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        contentContainerClassName="p-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ProjectCard {...item} />}
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
