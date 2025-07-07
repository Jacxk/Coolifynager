import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import LoadingScreen from "./LoadingScreen";

type LogObject = {
  output: string;
  hidden?: boolean;
};

type LogsViewerProps = {
  logs?: string | LogObject[];
  isLoading?: boolean;
  className?: string;
};

function LogLineFromObject(logs: LogObject[], className?: string) {
  return (
    <View className={cn("flex-1", className)}>
      {logs.map((log, index) => (
        <View className={"flex-row items-stretch w-full"} key={`log-${index}`}>
          <Text
            className={`font-mono${log.hidden ? " text-yellow-500" : ""}`}
            selectable
          >
            {log.output}
          </Text>
        </View>
      ))}
    </View>
  );
}

function LogLineFromString(logs: string, className?: string) {
  return (
    <View className={cn("flex-1", className)}>
      {logs.split("\n").map((line, index) => (
        <View className={"flex-row items-stretch w-full"} key={`line-${index}`}>
          <Text className="font-mono" selectable>
            {line}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function LogsViewer({
  logs,
  isLoading,
  className,
}: LogsViewerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const noLogs =
    !logs ||
    (Array.isArray(logs) && logs.length === 0) ||
    (typeof logs === "string" && logs.trim() === "");
  const isLogString = typeof logs === "string";

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }}
      className="flex-1 p-4 rounded-md border border-input"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      {isLoading ? (
        <LoadingScreen className="pt-4" />
      ) : noLogs ? (
        <View className="flex-1 pt-4 items-center">
          <Text className="border-0 text-muted-foreground font-mono">
            No logs found
          </Text>
        </View>
      ) : isLogString ? (
        LogLineFromString(logs, className)
      ) : (
        LogLineFromObject(logs, className)
      )}
    </ScrollView>
  );
}
