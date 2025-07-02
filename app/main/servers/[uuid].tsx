import { getProject } from "@/api/projects";
import { getServer } from "@/api/servers";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Server() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data } = useQuery(getServer(uuid));

  return (
    <View>
      <Text>{data?.name}</Text>
      <Text>{data?.uuid}</Text>
    </View>
  );
}
