import LogsViewer from "@/components/LogsViewer";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

type LogsData = {
  logs: string;
};

type ResourceLogsProps = {
  logsFetcher: (uuid: string, lines: number, options: any) => any;
};

export function ResourceLogs({ logsFetcher }: ResourceLogsProps) {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [lines, setLines] = useState("100");
  const [debouncedLines, setDebouncedLines] = useState("100");

  const { data: logData, isPending: isPendingLogs } = useQuery(
    logsFetcher(uuid, Number(debouncedLines), {
      refetchInterval: 2000,
      enabled: isFocused,
    })
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLines(lines);
    }, 500);

    return () => clearTimeout(timer);
  }, [lines]);

  return (
    <View className="flex-1 gap-2">
      <View className="flex">
        <Text className="text-muted-foreground text-sm">
          Only Show Number of Lines
        </Text>
        <View className="flex flex-row gap-2">
          <Input
            maxLength={10}
            keyboardType="numeric"
            value={lines}
            onChangeText={setLines}
            className="flex-1"
          />
        </View>
      </View>
      <LogsViewer
        logs={(logData as LogsData)?.logs}
        isLoading={isPendingLogs}
      />
    </View>
  );
}
