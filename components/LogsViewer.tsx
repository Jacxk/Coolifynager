import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";

interface LogObject {
  output: string;
  hidden?: boolean;
}

interface LogsViewerProps {
  logs: string | LogObject[];
  className?: string;
}

const LogsViewer: React.FC<LogsViewerProps> = ({ logs, className }) => {
  if (
    !logs ||
    (Array.isArray(logs) && logs.length === 0) ||
    (typeof logs === "string" && logs.trim() === "")
  ) {
    return (
      <View className="flex-1 pt-4 items-center">
        <Text className="border-0 text-muted-foreground font-mono">
          No logs found
        </Text>
      </View>
    );
  }
  if (typeof logs === "string") {
    return (
      <View className={className || "flex-1"}>
        {logs.split("\n").map((line, index) => (
          <View
            className={"flex-row items-stretch w-full"}
            key={`line-${index}`}
          >
            <Text className="font-mono" selectable>
              {line}
            </Text>
          </View>
        ))}
      </View>
    );
  }
  // logs is LogObject[]
  return (
    <View className={className || "flex-1"}>
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
};

export default LogsViewer;
