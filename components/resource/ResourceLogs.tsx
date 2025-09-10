import { ResourceHttpError } from "@/api/types/resources.types";
import LogsViewer from "@/components/LogsViewer";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  LOG_REFETCH_INTERVAL_STORAGE_KEY,
  LOGS_LINES_STORAGE_KEY,
} from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { UseQueryResult } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  const refetchInterval =
    Number(AsyncStorage.getItem(LOG_REFETCH_INTERVAL_STORAGE_KEY)) || 2000;

  const {
    data: logData,
    isPending: isPendingLogs,
    error,
  } = useLogsFetcher(uuid, Number(debouncedLines), {
    refetchInterval: !persistedError ? refetchInterval : 10000,
    enabled: isFocused && isInitialized,
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
      AsyncStorage.setItem(LOGS_LINES_STORAGE_KEY, lines);
    }, 500);

    return () => clearTimeout(timer);
  }, [lines]);

  useLayoutEffect(() => {
    AsyncStorage.getItem(LOGS_LINES_STORAGE_KEY).then((value) => {
      const lines = value || "100";
      setDebouncedLines(lines);
      setLines(lines);
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return null;
  }

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
