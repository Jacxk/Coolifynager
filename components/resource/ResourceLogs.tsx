import { ResourceHttpError } from "@/api/types/resources.types";
import LogsViewer from "@/components/LogsViewer";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useIsFocused } from "@react-navigation/native";
import { UseQueryResult } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

type LogsData = {
  logs: string;
};

type ResourceLogsProps = {
  useLogsFetcher: (
    uuid: string,
    lines: number,
    options: any
  ) => UseQueryResult<LogsData, Error>;
};

export function ResourceLogs({ useLogsFetcher }: ResourceLogsProps) {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [lines, setLines] = useState("100");
  const [debouncedLines, setDebouncedLines] = useState("100");
  const [persistedError, setPersistedError] = useState<
    ResourceHttpError | undefined
  >();

  const {
    data: logData,
    isPending: isPendingLogs,
    error,
  } = useLogsFetcher(uuid, Number(debouncedLines), {
    refetchInterval: !persistedError ? 2000 : 10000,
    enabled: isFocused,
  });

  useEffect(() => {
    if (error) {
      setPersistedError(error);
    } else if (logData) {
      setPersistedError(undefined);
    }
  }, [error, logData]);

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
        error={persistedError}
      />
    </View>
  );
}
