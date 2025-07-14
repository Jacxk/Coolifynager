import { CoolifyApplicationMetadataMap } from "@/api/types/application.types";
import { CoolifyDatabaseMetadataMap } from "@/api/types/database.types";
import {
  CoolifyResourceMetadata,
  ResourceType,
} from "@/api/types/resources.types";
import { CoolifyServiceMetadataMap } from "@/api/types/services.types";
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
import { Option } from "@rn-primitives/select";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { Pressable, SectionList, View } from "react-native";

type LocalSearchParams = {
  environments: string;
};

function ResourceCard({
  name,
  description,
  docs,
  onPress,
  type,
}: CoolifyResourceMetadata & {
  onPress: (resourceName: string) => void;
  type: ResourceType;
}) {
  return (
    <Pressable onPress={() => onPress(name)}>
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
  const { environments } = useLocalSearchParams<LocalSearchParams>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resourceName, setResourceName] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Option>(() => {
    const environmentsArray = environments.split(",");
    const [uuid, name] = environmentsArray[0].split(":");
    return {
      label: name,
      value: uuid,
    };
  });

  const mutation = useMutation({
    mutationFn: (type: ResourceType) => {
      // TODO: Implement create resource
      if (type === "application") {
        return createApplication(resourceName, selectedEnvironment?.value);
      } else if (type === "database") {
        return createDatabase(resourceName, selectedEnvironment?.value);
      } else if (type === "service") {
        return createService(resourceName, selectedEnvironment?.value);
      }
    },
  });

  const environmentsArray = environments.split(",");
  const applications: CoolifyResourceMetadata[] = Object.values(
    CoolifyApplicationMetadataMap
  );
  const databases: CoolifyResourceMetadata[] = Object.values(
    CoolifyDatabaseMetadataMap
  );
  const services: CoolifyResourceMetadata[] = Object.values(
    CoolifyServiceMetadataMap
  );

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
              type={section.type}
              onPress={(resourceName) => {
                setIsDialogOpen(true);
                setResourceName(resourceName);
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
              <Text className="text-xl font-bold">{resourceName}</Text> on{" "}
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

          <Select
            onValueChange={setSelectedEnvironment}
            defaultValue={selectedEnvironment}
          >
            <SelectTrigger>
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

          <AlertDialogFooter className="flex flex-row gap-2 self-end">
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Text>Create</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
