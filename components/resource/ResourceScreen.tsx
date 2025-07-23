import { ApplicationActionResponse } from "@/api/types/application.types";
import {
  ResourceActionResponse,
  ResourceBase,
  ResourceHttpError,
} from "@/api/types/resources.types";
import { EditingProvider, useEditing } from "@/context/EditingContext";
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

function extractDomains<T extends ResourceBase>(data: T): string[] {
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
}

function ResourceEditingForm<T extends ResourceBase>({
  data,
  onSubmitDetails,
}: {
  data: T;
  onSubmitDetails: (data: { name: string; description: string }) => void;
}) {
  const { isEditingDetails, setIsEditingDetails } = useEditing();

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

  if (!isEditingDetails) return null;

  const handleSave = (formData: { name: string; description: string }) => {
    onSubmitDetails(formData);
    setIsEditingDetails(false);
  };

  const handleCancel = () => {
    setIsEditingDetails(false);
    reset();
  };

  return (
    <>
      <View className="flex flex-row justify-between items-center">
        <View className="w-5/6">
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(onSubmitDetails)}
                autoCapitalize="words"
                placeholder="Resource name"
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500">Resource name is required.</Text>
          )}
        </View>
        <HealthIndicator status={data.status} />
      </View>
      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <Input
            className="mt-2"
            value={value}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit(onSubmitDetails)}
            placeholder="Resource description"
          />
        )}
      />

      <View className="flex-row gap-2 mt-4">
        <Button onPress={handleSubmit(handleSave)}>
          <Text>Save</Text>
        </Button>
        <Button variant="outline" onPress={handleCancel}>
          <Text>Cancel</Text>
        </Button>
      </View>
    </>
  );
}

function ResourceInfo<T extends ResourceBase>({
  data,
  insideHeaderRef,
  onSubmitDetails,
}: {
  data: T;
  insideHeaderRef: React.RefObject<View | null>;
  onSubmitDetails: (data: { name: string; description: string }) => void;
}) {
  const { isEditingDetails } = useEditing();

  if (isEditingDetails) {
    return (
      <ResourceEditingForm data={data} onSubmitDetails={onSubmitDetails} />
    );
  }

  return <ResourceDisplay data={data} insideHeaderRef={insideHeaderRef} />;
}

function ResourceDisplay<T extends ResourceBase>({
  data,
  insideHeaderRef,
}: {
  data: T;
  insideHeaderRef: React.RefObject<View | null>;
}) {
  const { setIsEditingDetails } = useEditing();

  return (
    <>
      <View className="flex flex-row justify-between items-center">
        <View
          ref={insideHeaderRef}
          className="w-5/6 flex-row items-center gap-2"
        >
          <H1 numberOfLines={1}>{data.name}</H1>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setIsEditingDetails(true)}
          >
            <Edit className="text-muted-foreground" />
          </Button>
        </View>
        <HealthIndicator status={data.status} />
      </View>
      <Text className="text-muted-foreground">{data.description}</Text>
    </>
  );
}

function ServerStatusWarning({ serverStatus }: { serverStatus: string }) {
  if (serverStatus === "running") return null;

  return (
    <Alert icon={Info} variant="destructive" className="mb-4">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        The server this resource is running on is not responding.
      </AlertDescription>
    </Alert>
  );
}

function useResourceMutations(
  uuid: string,
  isApplication: boolean,
  startResource: (uuid: string) => MutationObject,
  stopResource: (uuid: string) => MutationObject,
  restartResource: (uuid: string) => MutationObject,
  updateResource: (uuid: string) => MutationObject,
  refetch: () => void
) {
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

  return {
    startMutation,
    stopMutation,
    restartMutation,
    updateDetailsMutation,
    handleDeploy,
    handleStop,
    handleRestart,
    submitDetails,
  };
}

function ResourceScreenBase<T extends ResourceBase = ResourceBase>({
  getResource,
  startResource,
  stopResource,
  restartResource,
  updateResource,
  uuid,
  children,
  isDeploying,
  isApplication,
}: ResourceScreenProps<T>) {
  const isFocused = useIsFocused();
  const { isEditing } = useEditing();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const insideHeaderRef = useRef<View>(null);

  const { data, isPending, refetch } = useQuery<T>(
    getResource(uuid, {
      refetchInterval: 20000,
      enabled: isFocused && !isEditing,
    })
  );

  const {
    stopMutation,
    restartMutation,
    handleDeploy,
    handleStop,
    handleRestart,
    submitDetails,
  } = useResourceMutations(
    uuid,
    isApplication,
    startResource,
    stopResource,
    restartResource,
    updateResource,
    refetch
  );

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

  useRefreshOnFocus(refetch);

  const domains = useMemo<string[]>(
    () => extractDomains(data || ({} as T)),
    [data]
  );

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
          <ServerStatusWarning serverStatus={serverStatus} />

          <ResourceInfo
            data={data}
            insideHeaderRef={insideHeaderRef}
            onSubmitDetails={submitDetails}
          />
        </View>

        {children(data)}
      </ScrollView>
    </>
  );
}

export default function ResourceScreen<T extends ResourceBase = ResourceBase>(
  props: ResourceScreenProps<T>
) {
  return (
    <EditingProvider>
      <ResourceScreenBase {...props} />
    </EditingProvider>
  );
}
