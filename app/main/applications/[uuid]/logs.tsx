import { getApplicationLogs } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ApplicationLogs() {
  const [lines, setLines] = useState("100");
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const {
    data: logData,
    isPending: isPendingLogs,
    refetch,
    isRefetching,
  } = useQuery(getApplicationLogs(uuid, Number(lines)));

  const inset = useSafeAreaInsets();

  const Logs = () => {
    if (isPendingLogs) return <LoadingScreen />;
    if (!logData)
      return (
        <View className="flex-1 justify-center items-center">
          <H2 className="border-0 text-muted-foreground">No logs found</H2>
        </View>
      );

    return (
      <ScrollView
        className="flex-1 px-4 rounded-md border border-input"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View className="flex-1">
          {logData.logs.split("\n").map((line, index) => (
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
      </ScrollView>
    );
  };

  return (
    <View
      className="flex-1 m-4 gap-2"
      style={{
        paddingBottom: inset.bottom,
        paddingLeft: inset.left,
        paddingRight: inset.right,
      }}
    >
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
          <Button
            className="w-32"
            onPress={() => refetch()}
            loading={isRefetching}
          >
            <Text>Refresh</Text>
          </Button>
        </View>
      </View>
      <Logs />
    </View>
  );
}
