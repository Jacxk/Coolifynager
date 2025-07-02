import { getApplicationLogs } from "@/api/application";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
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
      <ScrollView>
        <View className="flex-1">
          {logData.logs.split("\n").map((line, index) => (
            <View key={index} className="flex-row items-stretch">

              <Text className="font-mono">
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
      className="flex-1 gap-4"
      style={{
        paddingBottom: inset.bottom,
      }}
    >
      <View className="flex flex-row gap-2">
        <Input
          maxLength={10}
          keyboardType="numeric"
          value={lines}
          onChangeText={setLines}
          className="flex-1"
        />
        <Button className="w-32" onPress={() => refetch()} loading={isRefetching}>
          <Text>Refresh</Text>
        </Button>
      </View>
      <Logs />
    </View>
  );
}
