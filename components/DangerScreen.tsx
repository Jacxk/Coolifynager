import { deleteService } from "@/api/services";
import { ResourceType } from "@/api/types/resources.types";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { useFavorites } from "@/context/FavoritesContext";
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

          <Checkbox
            checked={deleteVolumes}
            onCheckedChange={setDeleteVolumes}
            nativeID="delete-volumes"
          >
            <CheckboxIcon />
            <CheckboxLabel>
              Permanently delete all volumes associated with this resource.
            </CheckboxLabel>
          </Checkbox>

          <Checkbox
            checked={deleteNetworks}
            onCheckedChange={setDeleteNetworks}
            nativeID="delete-networks"
          >
            <CheckboxIcon />
            <CheckboxLabel>
              Permanently delete all non-predefined networks associated with
              this resource.
            </CheckboxLabel>
          </Checkbox>

          <Checkbox
            checked={deleteConfigFiles}
            onCheckedChange={setDeleteConfigFiles}
            nativeID="delete-config-files"
          >
            <CheckboxIcon />
            <CheckboxLabel>
              Permanently delete all configuration files from the server.
            </CheckboxLabel>
          </Checkbox>

          <Checkbox
            checked={runDockerCleanup}
            onCheckedChange={setRunDockerCleanup}
            nativeID="run-docker-cleanup"
          >
            <CheckboxIcon />
            <CheckboxLabel className="text-muted-foreground w-3/4">
              Run Docker Cleanup (remove unused images and builder cache).
            </CheckboxLabel>
          </Checkbox>

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
