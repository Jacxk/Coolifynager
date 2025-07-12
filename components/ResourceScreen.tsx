import { ApplicationActionResponse } from "@/api/types/application.types";
import {
  ResourceActionResponse,
  ResourceBase,
  ResourceHttpError,
} from "@/api/types/resources.types";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { cn } from "@/lib/utils";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { AnimatedHeader } from "./AnimatedHeaderTitle";
import { DomainsSelect } from "./DomainsSelect";
import { HealthDialog } from "./HealthDialog";
import LoadingScreen from "./LoadingScreen";
import { ResourceActions } from "./ResourceActions";
import { SafeView } from "./SafeView";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import { H1 } from "./ui/typography";

type QueryKey = string | number;

type QueryObject<T> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<T>;
  [key: string]: any; // Allow all React Query options
};

type MutationObject = {
  mutationKey: readonly unknown[];
  mutationFn: (...args: any[]) => Promise<any>;
};

export type ResourceScreenProps<T extends ResourceBase = ResourceBase> = {
  uuid: string;
  isDeploying: boolean;
  children: (data: T | undefined) => React.ReactNode;
  isApplication: boolean;
  isEnabled?: boolean;
  getResource: (
    uuid: string,
    options?: Omit<
      UseQueryOptions<T, Error, T, QueryKey[]>,
      "queryKey" | "queryFn"
    >
  ) => QueryObject<T>;
  startResource: (uuid: string) => MutationObject;
  stopResource: (uuid: string) => MutationObject;
  restartResource: (uuid: string) => MutationObject;
  updateResource: (uuid: string) => MutationObject;
};

export default function ResourceScreen<T extends ResourceBase = ResourceBase>({
  getResource,
  startResource,
  stopResource,
  restartResource,
  updateResource,
  uuid,
  children,
  isDeploying,
  isApplication,
  isEnabled = true,
}: ResourceScreenProps<T>) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const [isEditDetails, setIsEditDetails] = useState(false);

  const { data, isPending, refetch } = useQuery<T>(
    getResource(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && isEnabled && !isEditDetails,
    })
  );

  const [name, setName] = useState(data?.name ?? "");
  const [description, setDescription] = useState(data?.description ?? "");

  const healthy_running = data?.status === "running:healthy";
  const unhealthy_running = data?.status === "running:unhealthy";
  const unhealthy_exited = data?.status === "exited:unhealthy";

  const startMutation = useMutation({
    ...startResource(uuid),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deploy resource");
    },
  });
  const stopMutation = useMutation(stopResource(uuid));
  const restartMutation = useMutation({
    ...restartResource(uuid),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restart resource");
    },
  });

  const updateDetailsMutation = useMutation(updateResource(uuid));

  const handleDeploy = () => {
    if (isApplication) {
      startMutation.mutate(
        { force: false, instant_deploy: false },
        {
          onSuccess: ({
            deployment_uuid,
            message,
          }: ApplicationActionResponse) => {
            toast.success(message);
            router.push("./deployments");
            router.push({
              pathname: "./deployments/logs",
              params: { deployment_uuid },
            });
          },
        }
      );
    } else {
      startMutation.mutate(undefined, {
        onSuccess: ({ message }: ResourceActionResponse) => {
          toast.success(message);
        },
      });
    }
  };

  const handleStop = () => {
    stopMutation.mutate(undefined, {
      onSuccess: ({ message }: ResourceActionResponse) => {
        toast.success(message);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to stop resource");
      },
    });
  };

  const handleRestart = () => {
    if (isApplication) {
      restartMutation.mutate(undefined, {
        onSuccess: ({
          message,
          deployment_uuid,
        }: ApplicationActionResponse) => {
          toast.success(message);
          router.push({
            pathname: "./deployments",
            params: { uuid },
          });
          router.push({
            pathname: "./deployments/logs",
            params: { deployment_uuid },
          });
        },
      });
    } else {
      restartMutation.mutate(undefined, {
        onSuccess: ({ message }: ResourceActionResponse) => {
          toast.success(message);
        },
      });
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldShowHeader = scrollY > 20;
    setShowHeaderTitle(shouldShowHeader);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const submitDetails = () => {
    setIsEditDetails(false);
    toast.promise(
      updateDetailsMutation.mutateAsync({
        name,
        description,
      }),
      {
        loading: "Updating details...",
        success: () => {
          refetch();
          return "Details updated successfully!";
        },
        error: (err: unknown) => {
          return (
            (err as ResourceHttpError).message ?? "Failed to save changes."
          );
        },
      }
    );
  };

  useRefreshOnFocus(refetch);

  useLayoutEffect(() => {
    if (data) {
      let domains: string[] = [];

      if ("fqdn" in data && data.fqdn) {
        domains = (data.fqdn as string).split(",").filter(Boolean);
      } else if ("applications" in data && data.applications) {
        domains =
          (data.applications as any[])
            ?.map((app) => app.fqdn)
            .filter(Boolean)
            .flatMap((fqdn) => fqdn.split(","))
            .filter(Boolean) || [];
      }

      navigation.setOptions({
        header: () => (
          <AnimatedHeader
            name={data.name}
            status={data.status || ""}
            showTitle={showHeaderTitle}
            leftComponent={
              domains.length > 0 ? (
                <DomainsSelect domains={domains} />
              ) : undefined
            }
            rightComponent={
              <ResourceActions
                resourceType="application"
                isRunning={healthy_running || unhealthy_running}
                onStart={handleDeploy}
                onRedeploy={handleDeploy}
                onStop={handleStop}
                onRestart={handleRestart}
                isDeploying={isDeploying}
                stopDisabled={stopMutation.isPending}
                restartDisabled={restartMutation.isPending}
                showDeploy={true}
              />
            }
          />
        ),
        headerShown: true,
      });
    }
  }, [
    isDeploying,
    data,
    healthy_running,
    unhealthy_running,
    stopMutation.isPending,
    restartMutation.isPending,
    navigation,
    showHeaderTitle,
  ]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <SafeView className="p-0" bottomInset={false}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerClassName="gap-4 p-4"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
      >
        <Pressable onLongPress={() => setIsEditDetails(true)}>
          <View className="flex flex-row justify-between items-center">
            {isEditDetails ? (
              <Input
                value={name}
                onChangeText={setName}
                onSubmitEditing={submitDetails}
                autoCapitalize="words"
              />
            ) : (
              <H1 className="w-5/6" numberOfLines={1}>
                {data?.name}
              </H1>
            )}
            <TouchableOpacity
              className="w-1/6 items-end"
              onPress={() => setIsHealthDialogOpen(true)}
            >
              <View
                className={cn("size-4 rounded-full animate-pulse", {
                  "bg-red-500 animate-ping": unhealthy_exited,
                  "bg-green-500": healthy_running,
                  "bg-yellow-500": unhealthy_running,
                })}
              />
            </TouchableOpacity>
          </View>

          {isEditDetails ? (
            <Input
              value={description}
              onChangeText={setDescription}
              onSubmitEditing={submitDetails}
            />
          ) : (
            <Text className="text-muted-foreground">{data?.description}</Text>
          )}
        </Pressable>
        {isEditDetails && (
          <View className="flex-row gap-2">
            <Button onPress={submitDetails}>
              <Text>Save</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                setIsEditDetails(false);
                setName(data?.name ?? "");
                setDescription(data?.description ?? "");
              }}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        )}

        {children(data)}

        <HealthDialog
          isOpen={isHealthDialogOpen}
          onOpenChange={setIsHealthDialogOpen}
          status={data?.status}
          resourceType="application"
        />
      </ScrollView>
    </SafeView>
  );
}
