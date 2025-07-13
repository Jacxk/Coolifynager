import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";

export default function NetworkSection({
  ports_mappings,
  internal_db_url,
  external_db_url,
  is_public,
}: {
  ports_mappings: string | null;
  internal_db_url: string | null;
  external_db_url: string | null;
  is_public: boolean;
}) {
  return (
    <View className="gap-2">
      <H3>Network</H3>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Ports Mappings</Text>
        <Input
          placeholder="3000:5432"
          value={ports_mappings ?? ""}
          editable={false}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Postgres URL (internal)</Text>
        <Input value={internal_db_url ?? ""} editable={false} secureTextEntry />
      </View>
      {is_public && (
        <View className="flex-1 gap-1">
          <Text className="text-muted-foreground">Postgres URL (external)</Text>
          <Input
            value={external_db_url ?? ""}
            editable={false}
            secureTextEntry
          />
        </View>
      )}
    </View>
  );
}
