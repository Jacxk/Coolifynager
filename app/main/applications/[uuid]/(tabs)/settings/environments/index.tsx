import EnvironmentVariableList from "@/components/EnvironmentVariableList";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { router, useGlobalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
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
      className="p-4"
    >
      <H1 className="font-bold mb-4 text-center">Environment Variables</H1>
      <Button
        size="icon"
        variant="ghost"
        onPress={() => router.push("./environments/create")}
      >
        <Plus />
      </Button>
      <EnvironmentVariableList uuid={uuid} />
    </ScrollView>
  );
}
