import { getServices } from "@/api/services";
import LoadingScreen from "@/components/LoadingScreen";
import { SafeView } from "@/components/SafeView";
import { ServiceCard } from "@/components/ServiceCard";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ServicesIndex() {
  const { data, isPending } = useQuery(getServices);
  const inset = useSafeAreaInsets();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0) {
    return (
      <SafeView>
        <H1>Services</H1>
        <Text>No services found.</Text>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <H1>Services</H1>
      <FlatList
        className="flex-1 mt-4"
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <ServiceCard service={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeView>
  );
}
