import { getTeam } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Team() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useQuery(getTeam(id));

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>{data?.name}</Text>
      <Text>{data?.description}</Text>
      <Text>{data?.id}</Text>
      <Text>Members:</Text>
      {data?.members?.map((member) => (
        <Text key={member.id}>
          {member.name} ({member.email})
        </Text>
      ))}
    </View>
  );
}
