import EnvironmentVariableList from "@/components/EnvironmentVariableList";
import { SafeView } from "@/components/SafeView";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function ApplicationEnvironmentsIndex() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    queryClient
      .invalidateQueries({ queryKey: ["applications.envs", uuid] })
      .finally(() => setIsRefreshing(false));
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <SafeView bottomInset={false}>
        <EnvironmentVariableList uuid={uuid} />
      </SafeView>
    </ScrollView>
  );
}
