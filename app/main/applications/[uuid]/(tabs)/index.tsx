import { getApplication } from "@/api/application";
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
  const { data, isPending: isPendingApplication } = useQuery(
    getApplication(uuid)
  );

  if (isPendingApplication) {
    return <LoadingScreen />;
  }

  return (
    <SafeView className="p-4">
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.status}</Text>
      <Text>{data?.git_branch}</Text>
      <Text>{data?.git_commit_sha}</Text>
      <Text>{data?.git_repository}</Text>
        <DomainsSelect domains={data?.fqdn.split(",") as string[]} />
    </SafeView>
  );
}
