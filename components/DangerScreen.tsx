import { deleteService } from "@/api/services";
import { ResourceType } from "@/api/types/resources.types";
import { Text } from "@/components/ui/text";
import { useFavorites } from "@/hooks/useFavorites";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { SafeView } from "./SafeView";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { H1, H3 } from "./ui/typography";

// TODO: Add delete action
export default function DangerScreen({
  type,
  uuid,
}: {
  type?: ResourceType;
  uuid: string;
}) {
  const { removeFavorite } = useFavorites();

  const [deleteVolumes, setDeleteVolumes] = useState(true);
  const [deleteNetworks, setDeleteNetworks] = useState(true);
  const [deleteConfigFiles, setDeleteConfigFiles] = useState(true);
  const [runDockerCleanup, setRunDockerCleanup] = useState(true);

  const { mutateAsync: deleteResource } = useMutation(deleteService(uuid));

  const onDelete = () => {
    const runDeletion = async () => {
      if (type === "service")
        return await deleteResource({
          delete_volumes: deleteVolumes,
          delete_connected_networks: deleteNetworks,
          delete_configurations: deleteConfigFiles,
          docker_cleanup: runDockerCleanup,
        });
      else throw new Error("Not implemented");
    };
    toast.promise(runDeletion(), {
      loading: "Deleting resource...",
      success: () => {
        removeFavorite(uuid);
        router.dismissTo("/main");
        return "Resource deleted";
      },
      error: (error) => (error as Error).message ?? "Failed to delete resource",
    });
  };

  return (
    <SafeView className="gap-4">
      <View>
        <H1>Danger Zone</H1>
        <Text className="text-muted-foreground">
          Woah. I hope you know what are you doing.
        </Text>
      </View>
      <View>
        <H3>Delete Resource</H3>
        <Text className="text-muted-foreground">
          This will stop your containers, delete all related data, etc. Beware!
          There is no coming back!
        </Text>
      </View>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Text>Delete</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Resource Deletion?</AlertDialogTitle>
          </AlertDialogHeader>

          <View className="flex gap-3">
            <View className="flex-row items-center gap-2">
              <Checkbox
                checked={deleteVolumes}
                onCheckedChange={setDeleteVolumes}
                nativeID="delete-volumes"
              />
              <Text className="text-sm" nativeID="delete-volumes">
                Permanently delete all volumes associated with this resource.
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Checkbox
                checked={deleteNetworks}
                onCheckedChange={setDeleteNetworks}
                nativeID="delete-networks"
              />
              <Text className="text-sm" nativeID="delete-networks">
                Permanently delete all non-predefined networks associated with
                this resource.
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Checkbox
                checked={deleteConfigFiles}
                onCheckedChange={setDeleteConfigFiles}
                nativeID="delete-config-files"
              />
              <Text className="text-sm" nativeID="delete-config-files">
                Permanently delete all configuration files from the server.
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Checkbox
                checked={runDockerCleanup}
                onCheckedChange={setRunDockerCleanup}
                nativeID="run-docker-cleanup"
              />
              <Text className="text-sm" nativeID="run-docker-cleanup">
                Run Docker Cleanup (remove unused images and builder cache).
              </Text>
            </View>
          </View>

          <AlertDialogFooter className="flex flex-row gap-2 self-end">
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={onDelete}>
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeView>
  );
}
