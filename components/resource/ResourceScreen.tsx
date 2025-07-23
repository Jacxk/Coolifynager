import { ApplicationActionResponse } from "@/api/types/application.types";
import {
  ResourceActionResponse,
  ResourceBase,
  ResourceHttpError,
} from "@/api/types/resources.types";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Redirect, router, Stack } from "expo-router";
import { Info } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RefreshControl, ScrollView, View } from "react-native";
import { toast } from "sonner-native";
import { AnimatedHeader } from "../AnimatedHeaderTitle";
import { DomainsSelect } from "../DomainsSelect";
import { HealthIndicator } from "../HealthIndicator";
import { Edit } from "../icons/Edit";
import LoadingScreen from "../LoadingScreen";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { H1 } from "../ui/typography";
import { ResourceActions } from "./ResourceActions";

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
  children: (data: T) => React.ReactNode;
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const [isEditDetails, setIsEditDetails] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const insideHeaderRef = useRef<View>(null);

  const { data, isPending, refetch } = useQuery<T>(
    getResource(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && isEnabled && !isEditDetails,
    })
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    values: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

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
    let shouldShowHeader = false;

    insideHeaderRef.current?.measure((x, y, width, height, pageX, pageY) => {
      shouldShowHeader = scrollY > pageY - 10;
    });

    setShowHeaderTitle(shouldShowHeader);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const submitDetails = (data: { name: string; description: string }) => {
    toast.promise(
      updateDetailsMutation.mutateAsync({
        name: data.name,
        description: data.description,
      }),
      {
        loading: "Updating details...",
        success: () => {
          refetch();
          setIsEditDetails(false);
          return "Details updated successfully!";
        },
        error: (err: unknown) => {
          setIsEditDetails(true);
          return (
            (err as ResourceHttpError).message ?? "Failed to save changes."
          );
        },
      }
    );
  };

  useRefreshOnFocus(refetch);

  const domains = useMemo<string[]>(() => {
    if (!data) return [];

    if ("fqdn" in data && data.fqdn) {
      return (data.fqdn as string).split(",").filter(Boolean);
    } else if ("applications" in data && data.applications) {
      return (
        (data.applications as any[])
          ?.map((app) => app.fqdn)
          .filter(Boolean)
          .flatMap((fqdn) => fqdn.split(","))
          .filter(Boolean) || []
      );
    }
    return [];
  }, [data]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data) return <Redirect href="/main" />;

  const serverStatus = (data.destination ?? data).server.proxy.status;

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <AnimatedHeader
              name={data.name}
              status={data.status}
              showTitle={showHeaderTitle}
              onHeaderClick={() => scrollViewRef.current?.scrollTo({ y: 0 })}
              leftComponent={
                domains.length > 0 ? (
                  <DomainsSelect domains={domains} />
                ) : undefined
              }
              rightComponent={
                <ResourceActions
                  resourceType="application"
                  isRunning={data.status.startsWith("running")}
                  onStart={handleDeploy}
                  onRedeploy={handleDeploy}
                  onStop={handleStop}
                  onRestart={handleRestart}
                  isDeploying={isDeploying}
                  stopDisabled={stopMutation.isPending}
                  restartDisabled={restartMutation.isPending}
                  showDeploy={isApplication}
                />
              }
            />
          ),
          headerShown: true,
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerClassName="gap-4 p-4"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={true}
        contentInsetAdjustmentBehavior="never"
      >
        <View>
          {serverStatus !== "running" && (
            <Alert icon={Info} variant="destructive" className="mb-4">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                The server this resource is running on is not responding.
              </AlertDescription>
            </Alert>
          )}
          <View className="flex flex-row justify-between items-center">
            {isEditDetails ? (
              <View className="w-5/6">
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onSubmitEditing={handleSubmit(submitDetails)}
                      autoCapitalize="words"
                      placeholder="Resource name"
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-red-500">
                    Resource name is required.
                  </Text>
                )}
              </View>
            ) : (
              <View
                ref={insideHeaderRef}
                className="w-5/6 flex-row items-center gap-2"
              >
                <H1 numberOfLines={1}>{data.name}</H1>
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() => setIsEditDetails(true)}
                >
                  <Edit className="text-muted-foreground" />
                </Button>
              </View>
            )}
            <HealthIndicator status={data.status} />
          </View>

          {isEditDetails ? (
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <Input
                  className="mt-2"
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(submitDetails)}
                  placeholder="Resource description"
                />
              )}
            />
          ) : (
            <Text className="text-muted-foreground">{data.description}</Text>
          )}
        </View>
        {isEditDetails && (
          <View className="flex-row gap-2">
            <Button onPress={handleSubmit(submitDetails)}>
              <Text>Save</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                setIsEditDetails(false);
                reset();
              }}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        )}

        {children(data)}
      </ScrollView>
    </>
  );
}
