import { getService } from "@/api/services";
import LoadingScreen from "@/components/LoadingScreen";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Service() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { data, isPending } = useQuery(getService(uuid));

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.uuid}</Text>
    </View>
  );
}
