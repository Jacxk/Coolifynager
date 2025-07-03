import { getApplication } from "@/api/application";
import { ApplicationActions } from "@/components/ApplicationActions";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DomainsSelect({ domains }: { domains: string[] }) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select>
      <SelectTrigger className="w-[250px]">
        <Text>Domains</Text>
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          {domains.map((domain) => (
            <SelectItem
              onPress={() => openBrowserAsync(domain)}
              label={domain}
              value={domain}
              key={domain}
              hideIndicator
            >
              {domain}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function Application() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const {
    data,
    isPending: isPendingApplication,
    refetch,
  } = useQuery(getApplication(uuid));

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <SafeView className="p-4 gap-4 pt-0">
        <ApplicationActions />
        <View>
          <View className="flex flex-row justify-between items-center">
            <H1>{data?.name}</H1>
            <View
              className={cn("size-4 rounded-full animate-pulse", {
                "bg-green-500": data?.status === "running:healthy",
              })}
            />
          </View>
          <Text className="text-muted-foreground">{data?.description}</Text>
        </View>
        <Text>{data?.status}</Text>
        <Text>{data?.git_branch}</Text>
        <Text>{data?.git_commit_sha}</Text>
        <Text>{data?.git_repository}</Text>
        <DomainsSelect domains={data?.fqdn.split(",") as string[]} />
      </SafeView>
    </ScrollView>
  );
}
