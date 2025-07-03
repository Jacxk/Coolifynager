import { getApplications } from "@/api/application";
import { ApplicationCard } from "@/components/ApplicationCard";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

export default function ApplicationsIndex() {
  const { data, isPending } = useQuery(getApplications);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <H1>Applications</H1>
        <Text>No applications found.</Text>
      </View>
    );
  }

  return (
    <SafeView>
      <H1>Applications</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ApplicationCard application={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeView>
  );
}
