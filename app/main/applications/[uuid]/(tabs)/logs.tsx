import { getApplicationLogs } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import LogsViewer from "@/components/LogsViewer";
import { SafeView } from "@/components/SafeView";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";

export default function ApplicationLogs() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const isFocused = useIsFocused();

  const [lines, setLines] = useState("100");

  const { data: logData, isPending: isPendingLogs } = useQuery(
    getApplicationLogs(uuid, Number(lines), {
      refetchInterval: 2000,
      enabled: isFocused,
    })
  );

  return (
    <SafeView className="gap-2" bottomInset={false}>
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

      <ScrollView
        className="flex-1 p-4 rounded-md border border-input"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {isPendingLogs ? (
          <LoadingScreen className="pt-4" />
        ) : !logData ? (
          <View className="flex-1 pt-4 items-center">
            <Text className="border-0 text-muted-foreground font-mono">
              No logs found
            </Text>
          </View>
        ) : (
          <LogsViewer logs={logData.logs} />
        )}
      </ScrollView>
    </SafeView>
  );
}
