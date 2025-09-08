import {
  ProjectKeys,
  useDeleteProject,
  useProject,
  useProjects,
} from "@/api/projects";
import { Project, ProjectBase } from "@/api/types/project.types";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { SafeView } from "@/components/SafeView";
import { ResourcesSkeleton } from "@/components/skeletons/ProjectsSkeleton";
import { SwipeableCard } from "@/components/ui/swipe-card";
import { Text } from "@/components/ui/text";
import { useDestructiveAction } from "@/hooks/useDestructiveAction";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { toast } from "sonner-native";

const ProjectCard = ({ uuid, name, description }: ProjectBase) => {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteProject(uuid);
  const { handleDestructiveAction } = useDestructiveAction();

  const { data: project } = useProject(uuid);

  const isUndo = useRef(false);
  const position = useRef(0);
  const toastId = useRef<string | number | null>(null);
  const deletionTimeout = useRef<number | null>(null);

  if (!project) return null;

  const scheduleDeletion = () => {
    if (deletionTimeout.current) {
      clearTimeout(deletionTimeout.current);
    }

    // Performs the hard delete
    deletionTimeout.current = setTimeout(() => {
      if (!isUndo.current) {
        mutate();
      }
      isUndo.current = false;
    }, 5000);
  };

  const undoDeletion = () => {
    isUndo.current = true;

    if (deletionTimeout.current) {
      clearTimeout(deletionTimeout.current);
      deletionTimeout.current = null;
    }

    // Handles the optimistic update with undo
    queryClient.setQueryData(
      ProjectKeys.queries.all(),
      (data: ProjectBase[]) => {
        const existingIndex = data.findIndex((d) => d.uuid === project.uuid);
        if (existingIndex !== -1) {
          return data;
        }

        const newData = [...data];
        newData.splice(position.current, 0, project);
        return newData;
      }
    );

    // Handles the optimistic update with undo
    queryClient.setQueryData<Project>(
      ProjectKeys.queries.single(uuid),
      project
    );

    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
  };

  return (
    <SwipeableCard
      threshold={70}
      rightContentClassName="rounded-r-lg bg-red-400 dark:bg-red-500 -ml-4"
      rightContent={<Trash color="black" />}
      dismissOnSwipeLeft
      onDismiss={async () => {
        const queryKeyAll = ProjectKeys.queries.all();

        await queryClient.cancelQueries({ queryKey: queryKeyAll });

        isUndo.current = false;

        // Handles the optimistic update with undo
        queryClient.setQueryData(queryKeyAll, (data: ProjectBase[]) => {
          const index = data.findIndex((d) => d.uuid === project.uuid);
          const newData = [...data];
          newData.splice(index, 1);
          position.current = index;
          return newData;
        });

        handleDestructiveAction(
          () => {
            toastId.current = toast.success("Project deleted", {
              id: project.uuid,
              action: {
                label: "Undo",
                onClick: undoDeletion,
              },
            });

            scheduleDeletion();
          },
          {
            onCancel: undoDeletion,
            promptMessage: "Verify to delete project",
          }
        );
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
  const { data, isPending, refetch } = useProjects();
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
