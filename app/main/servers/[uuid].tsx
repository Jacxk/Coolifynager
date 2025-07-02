import { getServer } from "@/api/servers";
import LoadingScreen from "@/components/LoadingScreen";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Server() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending } = useQuery(getServer(uuid));

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>{data?.name}</Text>
      <Text>{data?.uuid}</Text>
    </View>
  );
}
