import { getTeam } from "@/api/teams";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Team() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useQuery(getTeam(id));

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
