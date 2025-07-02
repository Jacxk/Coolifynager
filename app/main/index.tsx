import { getApplications } from "@/api/application";
import { ApplicationCard } from "@/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export default function Index() {
  const { data: applications } = useQuery(getApplications);
  const setup = useSetup();

  return (
    <View className="p-8">
      <Text>App index</Text>
      <Button
        onPress={() => {
          setup.resetSetup();
        }}
      >
        <Text>Reset</Text>
      </Button>
      <Text>Applications</Text>
      {applications?.map((application) => (
        <ApplicationCard application={application} key={application.uuid} />
      ))}
    </View>
  );
}
