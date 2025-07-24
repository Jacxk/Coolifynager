import { createDatabase } from "@/api/databases";
import { createService } from "@/api/services";
import {
  CoolifyApplicationMetadataList,
  CoolifyApplications,
} from "@/api/types/application.types";
import {
  CoolifyDatabaseMetadataList,
  CoolifyDatabases,
} from "@/api/types/database.types";
import {
  CoolifyResourceMetadata,
  ResourceHttpError,
  ResourceType,
} from "@/api/types/resources.types";
import {
  CoolifyServiceMetadataList,
  CoolifyServices,
} from "@/api/types/services.types";
import EnvironmentSelect from "@/components/EnvironmentSelect";
import { BookOpenText } from "@/components/icons/BookOpenText";
import ServerSelect from "@/components/ServerSelect";
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
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import useStorage from "@/hooks/useStorage";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
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
  const environmentsArray = environments.split(",");

  const { server } = useStorage({});

  const [selectedEnvironment, setSelectedEnvironment] = useState(() => {
    const [uuid, name] = environmentsArray[0].split(":");
    return { uuid, name };
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [selectedResource, setSelectedResource] =
    useState<CoolifyResourceMetadata | null>(null);

  const { mutateAsync: createServiceMutation } = useMutation(createService());
  const { mutateAsync: createDatabaseMutation } = useMutation(createDatabase());

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

  const handleCreateService = () => {
    if (selectedType !== "service") return;
    if (!selectedResource || !server) return;

    router.back();
    toast.promise(
      createServiceMutation({
        type: selectedResource.type as CoolifyServices,
        environment_uuid: selectedEnvironment.uuid,
        server_uuid: server.uuid,
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

  const handleCreateDatabase = () => {
    if (selectedType !== "database") return;
    if (!selectedResource || !server) return;

    router.back();
    toast.promise(
      createDatabaseMutation({
        body: {
          server_uuid: server.uuid,
          environment_uuid: selectedEnvironment.uuid,
          environment_name: selectedEnvironment.name,
          project_uuid,
        },
        type: selectedResource.type as CoolifyDatabases,
      }),
      {
        loading: "Creating resource...",
        success: (data) => {
          router.navigate({
            pathname: "/main/databases/[uuid]/(tabs)",
            params: {
              uuid: data.uuid,
            },
          });
          return "Resource created successfully";
        },
        error: (error) => {
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

  const handleCreateApplication = (
    selectedResource: CoolifyResourceMetadata
  ) => {
    const type = selectedResource.type as CoolifyApplications;
    if (
      type === CoolifyApplications.PUBLIC_REPOSITORY ||
      type === CoolifyApplications.PRIVATE_REPOSITORY_DEPLOY_KEY
    ) {
      router.push({
        pathname: "/main/resources/create/application/git",
        params: {
          environment_uuid: selectedEnvironment.uuid,
          server_uuid: server?.uuid,
          project_uuid,
          type,
        },
      });
    } else if (type === CoolifyApplications.PRIVATE_REPOSITORY_GITHUB) {
      router.push({
        pathname: "/main/resources/create/application/git/private-app",
        params: {
          environment_uuid: selectedEnvironment.uuid,
          server_uuid: server?.uuid,
          project_uuid,
        },
      });
    }
  };

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
        renderItem={({ item, section }) => (
          <View className="mb-2 px-4">
            <ResourceCard
              {...item}
              onPress={() => {
                if (section.type === "application") {
                  handleCreateApplication(item);
                  return;
                }
                setIsDialogOpen(true);
                setSelectedResource(item);
                setSelectedType(section.type);
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
                {selectedEnvironment.name}
              </Text>
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              After creating the resource, you will be redirected to the
              resource page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <EnvironmentSelect
            environments={environmentsArray.map((env) => ({
              uuid: env.split(":")[0],
              name: env.split(":")[1],
            }))}
            defaultEnvironment={selectedEnvironment}
            onSelect={setSelectedEnvironment}
          />

          <ServerSelect />

          <AlertDialogFooter className="flex flex-row gap-2 self-end">
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={() => {
                if (selectedType === "service") {
                  handleCreateService();
                } else if (selectedType === "database") {
                  handleCreateDatabase();
                }
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
