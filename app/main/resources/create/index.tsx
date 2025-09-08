import { useCreateDatabase } from "@/api/databases";
import { useCreateService } from "@/api/services";
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
import { SearchIcon } from "@/components/icons/SearchIcon";
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
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import useStorage from "@/hooks/useStorage";
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
  const [searchKeyword, setSearchKeyword] = useState("");

  const { mutateAsync: createServiceMutation } = useCreateService();
  const { mutateAsync: createDatabaseMutation } = useCreateDatabase();

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
      data: applications.filter(
        (app) =>
          app.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          app.description.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
      type: "application" as ResourceType,
    },
    {
      title: "Databases",
      data: databases.filter(
        (db) =>
          db.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          db.description.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
      type: "database" as ResourceType,
    },
    {
      title: "Services",
      data: services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
      ),
      type: "service" as ResourceType,
    },
  ].filter((section) => section.data.length > 0);

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

  const navigateToCreatePage = (
    path:
      | "git"
      | "git/private-app"
      | "docker/docker-image"
      | "docker/docker-file"
      | "docker/docker-compose",
    type?: CoolifyApplications
  ) => {
    router.push({
      pathname: `/main/resources/create/application/${path}`,
      params: {
        environment_uuid: selectedEnvironment.uuid,
        server_uuid: server?.uuid,
        project_uuid,
        type,
      },
    });
  };

  const handleCreateApplication = (
    selectedResource: CoolifyResourceMetadata
  ) => {
    const type = selectedResource.type as CoolifyApplications;
    switch (type) {
      case CoolifyApplications.PUBLIC_REPOSITORY:
      case CoolifyApplications.PRIVATE_REPOSITORY_DEPLOY_KEY:
        navigateToCreatePage("git", type);
        break;
      case CoolifyApplications.PRIVATE_REPOSITORY_GITHUB:
        navigateToCreatePage("git/private-app", type);
        break;
      case CoolifyApplications.DOCKER_IMAGE:
        navigateToCreatePage("docker/docker-image", type);
        break;
      case CoolifyApplications.DOCKERFILE:
        navigateToCreatePage("docker/docker-file", type);
        break;
      case CoolifyApplications.DOCKER_COMPOSE_EMPTY:
        navigateToCreatePage("docker/docker-compose", type);
        break;
    }
  };

  return (
    <>
      <View className="p-4">
        <Input
          icon={<SearchIcon />}
          placeholder="Search resources..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          className="w-full"
        />
        <Text className="text-muted-foreground text-sm text-right">
          {sections.reduce((acc, section) => acc + section.data.length, 0)}{" "}
          resources found.
        </Text>
      </View>
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
          <Text className="text-muted-foreground p-4">No resources found.</Text>
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
