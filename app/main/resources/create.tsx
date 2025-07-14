import { getServers } from "@/api/servers";
import { createService } from "@/api/services";
import { CoolifyApplicationMetadataList } from "@/api/types/application.types";
import { CoolifyDatabaseMetadataList } from "@/api/types/database.types";
import {
  CoolifyResourceMetadata,
  ResourceHttpError,
  ResourceType,
} from "@/api/types/resources.types";
import {
  CoolifyServiceMetadataList,
  CoolifyServices,
} from "@/api/types/services.types";
import { BookOpenText } from "@/components/icons/BookOpenText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Option } from "@rn-primitives/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import { Pressable, SectionList, View } from "react-native";
import { toast } from "sonner-native";

type LocalSearchParams = {
  environments: string;
  project_uuid: string;
};

function ResourceCard({
  name,
  description,
  docs,
  onPress,
}: CoolifyResourceMetadata & {
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <CardHeader className="relative">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1"
            onPress={() => openBrowserAsync(docs)}
          >
            <BookOpenText className="text-muted-foreground" />
          </Button>
        </CardHeader>
      </Card>
    </Pressable>
  );
}

export default function CreateResource() {
  const { environments, project_uuid } =
    useLocalSearchParams<LocalSearchParams>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<CoolifyResourceMetadata | null>(null);
  const [selectedServer, setSelectedServer] = useState<Option>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<Option>(() => {
    const environmentsArray = environments.split(",");
    const [uuid, name] = environmentsArray[0].split(":");
    return {
      label: name,
      value: uuid,
    };
  });

  const { data: servers } = useQuery(getServers());
  const { mutateAsync: createServiceMutation } = useMutation(createService());

  const environmentsArray = environments.split(",");
  const applications: CoolifyResourceMetadata[] =
    CoolifyApplicationMetadataList;
  const databases: CoolifyResourceMetadata[] = CoolifyDatabaseMetadataList;
  const services: CoolifyResourceMetadata[] = CoolifyServiceMetadataList;

  const sections: {
    title: string;
    data: CoolifyResourceMetadata[];
    type: ResourceType;
  }[] = [
    {
      title: "Applications",
      data: applications,
      type: "application",
    },
    {
      title: "Databases",
      data: databases,
      type: "database",
    },
    {
      title: "Services",
      data: services,
      type: "service",
    },
  ];

  const handleCreateResource = () => {
    if (!selectedResource) return;
    router.back();
    toast.promise(
      createServiceMutation({
        type: selectedResource.type as CoolifyServices,
        environment_uuid: selectedEnvironment?.value!,
        server_uuid: selectedServer?.value!,
        project_uuid,
      }),
      {
        loading: "Creating resource...",
        success: (data) => {
          router.navigate({
            pathname: "/main/services/[uuid]/(tabs)",
            params: {
              uuid: data.uuid,
            },
          });
          return "Resource created successfully";
        },
        error: (error) => {
          console.error(error);
          router.navigate({
            pathname: "/main/resources/create",
            params: {
              environments,
              project_uuid,
            },
          });
          return (
            (error as ResourceHttpError).message ?? "Failed to create resource"
          );
        },
      }
    );
  };

  useEffect(() => {
    if (!selectedServer?.label || !selectedServer?.value) return;
    AsyncStorage.setItem(
      "selectedServer",
      JSON.stringify({
        name: selectedServer?.label,
        uuid: selectedServer?.value,
      })
    );
  }, [selectedServer]);

  useEffect(() => {
    AsyncStorage.getItem("selectedServer").then((value) => {
      if (value) {
        const server = JSON.parse(value);
        setSelectedServer({ label: server.name, value: server.uuid });
      }
    });
  }, []);

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.name}
        contentContainerClassName="gap-2 pb-10"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        renderSectionHeader={({ section }) => (
          <H3 className="p-4 bg-background">{section.title}</H3>
        )}
        renderItem={({ item }) => (
          <View className="mb-2 px-4">
            <ResourceCard
              {...item}
              onPress={() => {
                setIsDialogOpen(true);
                setSelectedResource(item);
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-muted-foreground">No resources found.</Text>
        }
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Create resource from{" "}
              <Text className="text-xl font-bold">
                {selectedResource?.name}
              </Text>{" "}
              on{" "}
              <Text className="text-xl font-bold">
                {selectedEnvironment?.label}
              </Text>
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              After creating the resource, you will be redirected to the
              resource page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <View>
            <Label nativeID="environment-label">Environment</Label>
            <Select
              onValueChange={setSelectedEnvironment}
              defaultValue={selectedEnvironment}
            >
              <SelectTrigger nativeID="environment-select">
                <SelectValue placeholder="Select an environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectLabel>Select Environment</SelectLabel>
                {environmentsArray.map((environment) => {
                  const [uuid, name] = environment.split(":");
                  return (
                    <SelectItem key={uuid} value={uuid} label={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </View>

          <View>
            <Label nativeID="server-label">Environment</Label>
            <Select
              onValueChange={setSelectedServer}
              defaultValue={selectedServer}
            >
              <SelectTrigger nativeID="server-select">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                <SelectLabel>Select Server</SelectLabel>
                {servers?.map((server) => (
                  <SelectItem
                    key={server.uuid}
                    value={server.uuid}
                    label={server.name}
                  >
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>

          <AlertDialogFooter className="flex flex-row gap-2 self-end">
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={() => {
                // TODO: Check which resource type is selected and create the correct resource
                handleCreateResource();
              }}
            >
              <Text>Create</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
