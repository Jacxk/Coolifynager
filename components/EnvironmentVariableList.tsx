import { ApplicationKeys, useApplicationEnvs } from "@/api/application";
import { ApplicationEnv } from "@/api/types/application.types";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, memo, useCallback } from "react";
import { RefreshControl, SectionList, View } from "react-native";
import { Card, CardContent } from "./ui/card";

type SectionData = {
  title: string;
  data: ApplicationEnv[];
  description: string;
};

// Memoized environment variable item component
const EnvironmentVariableItem = memo(({ env }: { env: ApplicationEnv }) => (
  <Card>
    <CardContent className="p-6 gap-2">
      <Input
        placeholder="Key"
        className="font-semibold"
        value={env.key}
        editable={false}
      />
      <PasswordInput
        placeholder="Value"
        className="text-xs text-muted-foreground"
        value={env.value}
      />
      <View className="flex flex-row gap-4 flex-wrap">
        <Checkbox
          checked={env.is_build_time}
          onCheckedChange={() => {}}
          disabled
        >
          <CheckboxLabel>Is Build Variable?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
        <Checkbox
          checked={env.is_multiline}
          onCheckedChange={() => {}}
          disabled
        >
          <CheckboxLabel>Is Multiline?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
        <Checkbox
          checked={env.is_literal}
          onCheckedChange={() => {}}
          disabled
        >
          <CheckboxLabel>Is Literal?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
      </View>
    </CardContent>
  </Card>
));

// Memoized section header component
const SectionHeader = memo(({ section }: { section: SectionData }) => (
  <View className="mb-4 bg-background py-4">
    <H2 className="font-semibold border-0 pb-1">{section.title}</H2>
    <Text className="text-muted-foreground">{section.description}</Text>
  </View>
));

// Memoized empty section component
const EmptySection = memo(({ section }: { section: SectionData }) => (
  <Text className="mb-4">
    No{" "}
    {section.title.toLowerCase().includes("production")
      ? "production"
      : "preview"}{" "}
    environment variables found.
  </Text>
));

const EnvironmentVariableList = memo(function EnvironmentVariableList({ 
  uuid 
}: { 
  uuid: string 
}) {
  const { data: envs, isPending } = useApplicationEnvs(uuid);

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    queryClient
      .invalidateQueries({ queryKey: ApplicationKeys.queries.envs(uuid) })
      .finally(() => setIsRefreshing(false));
  }, [queryClient, uuid]);

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => {
    if (!envs) return [];
    
    const previewEnvs = envs.filter((env) => env.is_preview) || [];
    const productionEnvs = envs.filter((env) => !env.is_preview) || [];

    return [
      {
        title: "Production Deployments Environment Variables",
        data: productionEnvs,
        description: "Environment (secrets) variables for Production.",
      },
      {
        title: "Preview Deployments Environment Variables",
        data: previewEnvs,
        description: "Environment (secrets) variables for Preview Deployments.",
      },
    ] as SectionData[];
  }, [envs]);

  const renderEnv = useCallback(({ item: env }: { item: ApplicationEnv }) => (
    <EnvironmentVariableItem env={env} />
  ), []);

  const renderSectionHeader = useCallback(({ section }: { section: SectionData }) => (
    <SectionHeader section={section} />
  ), []);

  const renderEmptySection = useCallback(({ section }: { section: SectionData }) => (
    <EmptySection section={section} />
  ), []);

  const keyExtractor = useCallback((item: ApplicationEnv) => item.uuid, []);

  const renderSectionFooter = useCallback(({ section }: { section: SectionData }) =>
    section.data.length === 0 ? <EmptySection section={section} /> : null
  , []);

  if (isPending) return <LoadingScreen />;

  return (
    <SectionList
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      sections={sections}
      renderItem={renderEnv}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      contentContainerClassName="p-4 gap-2"
      ListEmptyComponent={
        <Text className="text-center text-muted-foreground">
          No environment variables found.
        </Text>
      }
      renderSectionFooter={renderSectionFooter}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
});

export default EnvironmentVariableList;
