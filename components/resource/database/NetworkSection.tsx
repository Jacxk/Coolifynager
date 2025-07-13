import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
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
        <InfoDialog
          label="Ports Mappings"
          title="Ports Mappings"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                A comma separated list of ports you would like to map to the
                host system.
              </Text>
              <Text className="text-muted-foreground">
                <Text className="font-bold text-yellow-500">Example:</Text>{" "}
                3000:5432,3002:5433
              </Text>

              <ReadOnlyText />
            </View>
          }
        />
        <Input
          placeholder="3000:5432"
          value={ports_mappings ?? ""}
          editable={false}
        />
      </View>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="Postgres URL (internal)"
          title="Postgres URL (internal)"
          description="If you change the user/password/port, this could be different.
          This is with the default values."
        />
        <Input value={internal_db_url ?? ""} editable={false} secureTextEntry />
      </View>
      {is_public && (
        <View className="flex-1 gap-1">
          <InfoDialog
            label="Postgres URL (external)"
            title="Postgres URL (external)"
            description="If you change the user/password/port, this could be different.
            This is with the default values."
          />
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
